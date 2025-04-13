from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_login import LoginManager, login_user, logout_user, current_user, login_required
from models import db
from sqlalchemy.orm.exc import NoResultFound
from flask_migrate import Migrate
from functools import wraps
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:\d+"}}, supports_credentials=True)
api = Api(app)
app.config['SECRET_KEY'] = 'a9b7f8cbe34d4fd28b239872c88f199e'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)

from models import db, User, Customer, Admin, Loan, LoanSettings, SavingsAccount, Transaction

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def login_required_resource(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return {'error': 'Authentication required'}, 401
        return func(*args, **kwargs)
    return wrapper


def customer_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return {'error': 'Authentication required'}, 401
        if current_user.role != 'customer':
            return {'error': 'Access denied: customers only'}, 403
        return func(*args, **kwargs)
    return wrapper



def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated:
            return {'error': 'Authentication required'}, 401
        if current_user.role != 'admin':
            return {'error': 'Access denied: admin only'}, 403
        return func(*args, **kwargs)
    return wrapper


class AdminSignup(Resource):
    # Anyone hitting the signup page will be registered as an admin.
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not all([username, email, password]):
            return {"error": "Missing required fields (username, email, password)"}, 400
        
        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return {"error": "Username or Email already exists"}, 400
        
        # Automatically set role to admin
        new_user = User(username=username, email=email, role="admin")
        provided_password = password  # retain the provided password for response details
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        # Create the associated admin profile
        admin_profile = Admin(user=new_user)
        db.session.add(admin_profile)
        db.session.commit()
        
        return {
            "message": "Admin registered successfully",
            "login_details": {
                "username": new_user.username,
                "email": new_user.email,
                "password": provided_password,
                "role": new_user.role
            }
        }, 201

# -----------------------------------------------------
# ADMIN-ONLY User Creation (Registration is Admin Controlled)
# -----------------------------------------------------
class AdminCreateUserResource(Resource):
    @admin_required
    def post(self):
        data = request.get_json()

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')  # Expected: 'customer', 'staff', (or 'admin' if desired)

        if role !='customer':
            return {'error': 'Invalid role. Only customer can be created via this endpoint.'}, 400

        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            return {'error': 'Username or Email already exists'}, 400
        
        provided_password = password
        new_user = User(username=username, email=email, role=role)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        # Create the corresponding role-based profile
        if role == 'customer':
            customer = Customer(user=new_user)
            db.session.add(customer)
            savings = SavingsAccount(customer=customer, balance=0.0)
            db.session.add(savings)
        db.session.commit()

        return {
            'message': f'{role.capitalize()} created successfully!',
            "login_details": {
                "username": new_user.username,
                "email": new_user.email,
                "password": provided_password,
                "role": new_user.role
            }
        }, 201



# -----------------------------------------------------
# Login & Logout
# -----------------------------------------------------
class Login(Resource): 
     def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user)
            return {
                'message': f'Logged in as {user.username}',
                'user': {  # Frontend expects this structure
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role  # Add if you have role-based access
                }
            }, 200
        return {'error': 'Invalid credentials'}, 401
     
class Logout(Resource):
    def get(self):
        if current_user.is_authenticated:
            logout_user()
            return {'message': 'Logged out successfully!'}, 200
        return {'error': 'No user logged in'}, 400

class DashboardResource(Resource):
    def get(self):
        if current_user.role == 'customer':
            customer = current_user.customer
            return jsonify({
                'username': current_user.username,
                'savings_balance': customer.savings_account.balance,
                'account_number': customer.savings_account.id
            })
        elif current_user.role == 'admin':
            return jsonify({'message': f'Admin dashboard: {current_user.username}'})
        else:
            return jsonify({'error': 'Unauthorized'}), 403


# -----------------------------------------------------
# User Management for Admins
# -----------------------------------------------------
class UserManagement(Resource):
    @admin_required
    def put(self, user_id):
        data = request.get_json()
        new_role = data.get('role')  # Example: updating a user's role

        if new_role not in ['customer', 'staff', 'admin']:
            return {'error': 'Invalid role'}, 400

        user = User.query.get_or_404(user_id)
        user.role = new_role  # Update the user's role
        db.session.commit()

        return {'message': f'User {user_id} updated to {new_role} role'}, 200

    @admin_required
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        
        
        # Admins cannot delete other admins
        if current_user.role == 'admin' and user.role == 'admin':
            return {'error': 'Cannot delete an admin user'}, 400
        
        db.session.delete(user)
        db.session.commit()
        return {'message': f'User {user_id} deleted successfully'}, 200


# -----------------------------------------------------
# Loan Endpoints (Application, Status, Management)
# -----------------------------------------------------
class LoanListResource(Resource):
    @admin_required
    def get(self):
        status = request.args.get('status')
        loans_query = Loan.query
        if status:
            loans_query = loans_query.filter_by(status=status)
        loans = loans_query.all()
        loans_data = [{
            'id': loan.id,
            'amount': loan.amount,
            'interest_rate': loan.interest_rate,
            'status': loan.status,
            'customer_id': loan.customer_id,
            'loan_duration': loan.loan_duration
        } for loan in loans]
        return {'loans': loans_data}

class LoanApply(Resource):
    @customer_required
    def post(self):
        data = request.get_json()
        amount = data.get('amount')
        loan_duration = data.get('loan_duration')

        if not all([amount, loan_duration]):
            return {'error': 'Missing loan details'}, 400
        
        if amount <= 0 or loan_duration <= 0:
            return {'error': 'Invalid loan details'}, 400

        settings = LoanSettings.query.first()
        if not settings:
            return {'error': 'Interest rate configuration missing. Contact admin.'}, 500
        interest_rate = settings.default_interest_rate

        new_loan = Loan(
            amount=amount,
            interest_rate=settings.default_interest_rate,
            loan_duration=loan_duration,
            customer_id=current_user.customer.id
        )
        db.session.add(new_loan)
        db.session.commit()

        return {'message': 'Loan application submitted successfully!'}, 201


class LoanStatus(Resource):
    @customer_required
    def get(self, loan_id):
        loan = Loan.query.filter_by(
            id=loan_id, 
            customer_id=current_user.customer.id  # Corrected foreign key
        ).first_or_404()
        
        return {
            'loan_id': loan.id,
            'amount': loan.amount,
            'status': loan.status,
            'interest_rate': loan.interest_rate,
            'loan_duration': loan.loan_duration
        }



class LoanManagement(Resource):
    @admin_required
    def put(self, loan_id):

        data = request.get_json()
        status = data.get('status')  # Expected: 'approved' or 'rejected'
        if status not in ['approved', 'rejected']:
            return {'error': 'Invalid status'}, 400

        loan = Loan.query.get_or_404(loan_id)
        if status == 'approved':
            loan.approve_loan(current_user)
        else:
            loan.reject_loan(current_user)

        db.session.commit()
        return {'message': f'Loan {status} successfully'}, 200


#Retrieve approval history
class LoanApprovalsResource(Resource):
    @admin_required
    def get(self, loan_id):
        loan = Loan.query.get_or_404(loan_id)
        approvals = [{
            'admin': approval.admin.user.username,
            'action': approval.action,
            'timestamp': approval.timestamp.isoformat()
        } for approval in loan.approvals]
        return jsonify({'approvals': approvals})

class LoanSettingsResource(Resource):
    @admin_required
    def put(self):
        data = request.get_json()
        new_rate = data.get('interest_rate')
        if not new_rate or new_rate <= 0:
            return {'error': 'Invalid interest rate'}, 400

        settings = LoanSettings.query.first()
        if not settings:
            settings = LoanSettings(default_interest_rate=new_rate)
            db.session.add(settings)
        else:
            settings.default_interest_rate = new_rate
        
        db.session.commit()
        return {'message': f'Default interest rate updated to {new_rate}%'}, 200


# -----------------------------------------------------
# Savings and Loan Repayment Endpoints
# -----------------------------------------------------
class Savings(Resource):
    @customer_required
    def get(self):
        savings = current_user.customer.savings_account
        return {'balance': savings.balance}, 200

    @customer_required
    def post(self):
        data = request.get_json()
        amount = data.get('amount')
        action = data.get('action')  # 'deposit' or 'withdraw'

        if not amount or amount <= 0 or action not in ['deposit', 'withdraw']:
            return {'error': 'Invalid request'}, 400

        savings = current_user.customer.savings_account
        try:
            if action == 'deposit':
                transaction = savings.deposit(amount)
            elif action == 'withdraw':
                transaction = savings.withdraw(amount)  # Now creates a pending transaction
            return {'message': f'{action} pending admin approval', 'transaction_id': transaction.id}, 200
        except ValueError as e:
            return {'error': str(e)}, 400

class LoanRepayment(Resource):
    @customer_required
    def post(self, loan_id):
        data = request.get_json()
        amount = data.get('amount')

        if not amount or amount <= 0:
            return {'error': 'Invalid repayment amount'}, 400

        loan = Loan.query.filter_by(id=loan_id, customer_id=current_user.customer.id).first_or_404()
        try:
            repayment = loan.add_repayment(
                customer=current_user.customer,
                amount=amount
            )
            return {'message': 'Repayment successful', 'remaining_due': loan.remaining_amount()}, 200
        except Exception as e:
            return {'error': str(e)}, 400
class RepayLoanResource(Resource):
    @login_required
    def post(self):
        if current_user.role != 'customer':
            return {"error": "Only customers can make repayments"}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('loan_id', type=int, required=True, help='Loan ID is required')
        parser.add_argument('amount', type=float, required=True, help='Amount is required')
        parser.add_argument('payment_method', type=str, help='Payment method (optional)')
        parser.add_argument('reference', type=str, help='Payment reference (optional)')
        args = parser.parse_args()

        loan_id = args['loan_id']
        amount = args['amount']
        method = args['payment_method']
        reference = args['reference']

        customer = current_user.customer
        if not customer:
            return {"error": "User has no customer profile"}, 404

        loan = Loan.query.filter_by(id=loan_id).first()
        if not loan:
            return {"error": "Loan not found"}, 404

        if loan.customer_id != customer.id:
            return {"error": "You do not own this loan"}, 403

        try:
            repayment = loan.add_repayment(
                customer=customer,
                amount=amount,
                method=method,
                ref=reference
            )
            total_repaid = sum(r.amount for r in loan.repayments)
            return {
                "message": "Repayment successful",
                "repayment_id": repayment.id,
                "loan_status": loan.status,
                "total_repaid": total_repaid
            }, 200
        except Exception as e:
            return {"error": str(e)}, 400


class LoanRepaymentsResource(Resource):
    def get(self, loan_id):
        loan = Loan.query.filter_by(id=loan_id).first()
        if not loan:
            return {"error": "Loan not found"}, 404

        repayments = [{
            "amount": r.amount,
            "payment_date": r.payment_date,
            "method": r.payment_method,
            "reference": r.reference
        } for r in loan.repayments]

        return {
            "loan_id": loan.id,
            "repayments": repayments
        }


# -----------------------------------------------------
# Deposit and Withdrawal Endpoints using Transaction Model
# -----------------------------------------------------
class DepositResource(Resource):
    @login_required
    def post(self):
        if current_user.role != 'customer':
            return {"error": "Only customers can make deposits"}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('amount', type=float, required=True, help="Amount is required")
        parser.add_argument('reference', type=str, help="Transaction reference (optional)")
        args = parser.parse_args()

        customer = current_user.customer
        savings_account = customer.savings_account
        if not savings_account:
            return {"error": "Customer does not have a savings account"}, 404

        try:
            transaction = savings_account.deposit(args['amount'], args['reference'])
            return {
                "message": "Deposit successful",
                "transaction_id": transaction.id,
                "balance": savings_account.balance
            }, 200
        except ValueError as e:
            return {"error": str(e)}, 400


class WithdrawResource(Resource):
    @login_required
    def post(self):
        if current_user.role != 'customer':
            return {"error": "Only customers can make withdrawals"}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('amount', type=float, required=True, help="Amount is required")
        parser.add_argument('reference', type=str, help="Transaction reference (optional)")
        args = parser.parse_args()

        customer = current_user.customer
        savings_account = customer.savings_account
        if not savings_account:
            return {"error": "Customer does not have a savings account"}, 404

        try:
            transaction = savings_account.withdraw(args['amount'], args['reference'])
            return {
                "message": "Withdrawal successful",
                "transaction_id": transaction.id,
                "balance": savings_account.balance
            }, 200
        except ValueError as e:
            return {"error": str(e)}, 400


# -----------------------------------------------------
# Admin Approval/Rejection for Withdrawal Transactions
# -----------------------------------------------------
class AdminApproveRejectTransactionResource(Resource):
    
    # In AdminApproveRejectTransactionResource class
    @admin_required
    def put(self, transaction_id, action):
        if current_user.role != 'admin':
            return {"error": "Unauthorized"}, 403
        
        transaction = Transaction.query.get_or_404(transaction_id)
        if transaction.transaction_type != 'withdrawal' or transaction.status != 'pending':
            return {"error": "Invalid transaction"}, 400
        if action == 'approve':
            # Check if balance is sufficient
            savings_account = transaction.customer.savings_account
            if savings_account.balance < transaction.amount:
                return {"error": "Insufficient funds for withdrawal"}, 400
            
            transaction.approve()
            savings_account.balance -= transaction.amount  # Deduct balance here
        elif action == 'reject':
            transaction.reject()
        else:
            return {"error": "Invalid action"}, 400
        db.session.commit()
        return {"message": f"Transaction {action}d"}, 200
    
class PendingWithdrawalTransactions(Resource):
    @admin_required
    def get(self):
        if current_user.role != 'admin':
            return {"error": "Unauthorized"}, 403
        pending_withdrawals = Transaction.query.filter_by(
            transaction_type='withdrawal',
            status='pending'
        ).all()

        withdrawals_data = [{
            'id': t.id,
            'amount': t.amount,
            'customer_id': t.customer_id,
            'reference': t.reference,
            'created_at': t.created_at.isoformat()
        } for t in pending_withdrawals]

        return jsonify({'withdrawals': withdrawals_data})
    
# -----------------------------------------------------
# Reporting Endpoints
# -----------------------------------------------------
class LoanReportResource(Resource):
    @admin_required
    def get(self):
        # Aggregate loans by status
        loans_by_status = db.session.query(
            Loan.status,
            db.func.count(Loan.id).label('count'),
            db.func.sum(Loan.amount).label('total_amount'),
            db.func.avg(Loan.interest_rate).label('avg_interest_rate')
        ).group_by(Loan.status).all()

        report = {
            status: {
                'count': count,
                'total_amount': total_amount,
                'avg_interest_rate': avg_interest_rate
            } for status, count, total_amount, avg_interest_rate in loans_by_status
        }
        return report


class TransactionReportResource(Resource):
    @admin_required
    def get(self):
        # Filter by date range (optional)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = db.session.query(
            Transaction.transaction_type,
            Transaction.status,
            db.func.count(Transaction.id).label('count'),
            db.func.sum(Transaction.amount).label('total_amount')
        )

        if start_date:
            query = query.filter(Transaction.created_at >= start_date)
        if end_date:
            query = query.filter(Transaction.created_at <= end_date)

        transactions = query.group_by(Transaction.transaction_type, Transaction.status).all()

        report = {}
        for type_, status, count, total in transactions:
            if type_ not in report:
                report[type_] = {}
            report[type_][status] = {'count': count, 'total_amount': total}
        
        return report


class TransactionHistoryResource(Resource):
    @customer_required
    def get(self):
        # Get customer's transaction history
        customer = current_user.customer
        transactions = Transaction.query.filter_by(customer_id=customer.id).all()
        
        return jsonify([{
            'id': t.id,
            'amount': t.amount,
            'type': t.transaction_type,
            'status': t.status,
            'date': t.created_at.isoformat(),
            'reference': t.reference
        } for t in transactions])

# -----------------------------------------------------
# Register Resources with API
# -----------------------------------------------------
api.add_resource(AdminSignup, '/api/signup')
api.add_resource(AdminCreateUserResource, '/api/admin/create-user')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')
api.add_resource(UserManagement, '/api/user/<int:user_id>')
api.add_resource(DashboardResource, '/api/dashboard')
api.add_resource(LoanListResource, '/api/loans')
api.add_resource(LoanApply, '/api/loan/apply')
api.add_resource(LoanStatus, '/api/loan/<int:loan_id>')
api.add_resource(LoanApprovalsResource, '/api/loan/<int:loan_id>/approvals')
api.add_resource(LoanManagement, '/api/loan/<int:loan_id>/manage')
api.add_resource(LoanSettingsResource, '/api/admin/loan-settings')
api.add_resource(LoanRepaymentsResource, '/loan/<int:loan_id>/repayments')
api.add_resource(RepayLoanResource, '/api/repay-loan')
api.add_resource(DepositResource, '/api/deposit')
api.add_resource(WithdrawResource, '/api/withdraw')
api.add_resource(AdminApproveRejectTransactionResource, '/api/admin/withdrawal-transaction/<int:transaction_id>/<string:action>')
api.add_resource(PendingWithdrawalTransactions, '/api/admin/withdrawal-transactions')
api.add_resource(LoanReportResource, '/api/reports/loans')
api.add_resource(TransactionReportResource, '/api/reports/transactions')
api.add_resource(TransactionHistoryResource, '/api/transactions')

if __name__ == '__main__':
    app.run(debug=True)
