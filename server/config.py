from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
api = Api()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Config
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = "super-secret-key"

    app.config.update(
        SESSION_COOKIE_NAME="session",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_SAMESITE="Lax",
    )

    # Init extensions
    db.init_app(app)
    api.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    CORS(app,
         supports_credentials=True,
         origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5175",
            "http://127.0.0.1:5175"
         ],
         allow_headers=["Content-Type"],
         methods=["GET","POST","OPTIONS"]
    )

    # Import resources
    from resources.auth import Login, Logout, CheckSession, CurrentCustomer
    from resources.admin import AdminResource
    from resources.staff import StaffResource
    from resources.customer import CustomerResource
    from resources.loan import LoanResource
    from resources.finance import Finance, SavingsTransactionResource
    from resources.audit import AuditLogResource

    # Add API resources
    api.add_resource(Login, "/login")
    api.add_resource(Logout, "/logout")
    api.add_resource(CheckSession, "/check-session")
    api.add_resource(CurrentCustomer, "/current-customer")

    api.add_resource(AdminResource, "/admin", "/admin/<int:id>")
    api.add_resource(StaffResource, "/staff", "/staff/<int:id>")
    api.add_resource(CustomerResource, "/customer", "/customer/<int:id>")
    api.add_resource(LoanResource, "/loan", "/loan/<int:id>")

    api.add_resource(Finance, "/repayment", "/repayment/<int:id>")
    api.add_resource(SavingsTransactionResource, "/savings-transaction", "/savings-transaction/<int:id>")

    api.add_resource(AuditLogResource, "/audit-log", "/audit-log/<int:id>")

    # Regular Flask routes
    @app.route("/")
    def index():
        return {"message": "Malibora API running"}

    @app.route("/test-data")
    def test_data():
        from models import Admin, Customer
        admins_count = Admin.query.count()
        customers_count = Customer.query.count()
        return {"admins": admins_count, "customers": customers_count}

    @app.route("/customers-loans")
    def customers_loans():
        from models import Customer
        result = []
        for customer in Customer.query.all():
            result.append({
                "customer_id": customer.id,
                "name": customer.full_name,
                "loans": [{"loan_id": l.id, "amount": l.amount, "status": l.status} for l in customer.loans]
            })
        return {"data": result}

    @app.route("/staff-customers")
    def staff_customers():
        from models import Staff
        result = []
        for staff in Staff.query.all():
            result.append({
                "staff_id": staff.id,
                "name": staff.full_name,
                "assigned_customers": [
                    {"customer_id": sc.customer.id, "name": sc.customer.full_name, "notes": sc.notes} 
                    for sc in staff.staff_customers
                ]
            })
        return {"data": result}
    
    @app.route("/list-customers")
    def list_customers():
        from models import Customer
        return {
            "customers": [
                {"id": c.id, "full_name": c.full_name } 
                for c in Customer.query.all()
        ]
    }

    @app.route("/list-staff")
    def list_staff():
        from models import Staff
        return {"staff": [s.full_name for s in Staff.query.all()]}

    @app.route("/me", methods=["GET"])
    def me():
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401

        return {
            "id": session["user_id"],
            "role": session["role"],
            "full_name": session["full_name"]
        }, 200

    @app.route("/loans")
    def loans():
        """
        Role-based loan access:
        - Admin: sees ALL loans
        - Staff: sees loans of customers they manage
        - Customer: sees only their own loans
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        from models import Loan, StaffCustomer
        
        user_role = session.get("role")
        user_id = session.get("user_id")
        
        if user_role == "admin":
            # Admin sees all loans
            loans = Loan.query.all()
            
        elif user_role == "staff":
            # Staff sees loans of customers they manage
            staff_customer_ids = [
                sc.customer_id for sc in StaffCustomer.query.filter_by(staff_id=user_id).all()
            ]
            loans = Loan.query.filter(Loan.customer_id.in_(staff_customer_ids)).all()
            
        elif user_role == "customer":
            # Customer sees only their own loans
            loans = Loan.query.filter_by(customer_id=user_id).all()
            
        else:
            return {"error": "Invalid role"}, 403
        
        return {
            "loans": [
                {
                    "id": loan.id,
                    "amount": loan.amount,
                    "status": loan.status,
                    "customer_id": loan.customer_id,
                    "amount_paid": getattr(loan, 'amount_paid', 0),
                    "interest_rate": getattr(loan, 'interest_rate', None),
                    "next_payment_date": loan.next_payment_date.strftime("%b %d, %Y") if hasattr(loan, 'next_payment_date') and loan.next_payment_date else None,
                    "created_at": loan.created_at.strftime("%b %d, %Y") if hasattr(loan, 'created_at') and loan.created_at else None,
                    "customer_name": loan.customer.full_name if hasattr(loan, 'customer') else None
                } for loan in loans
            ]
        }

    @app.route("/loans/<int:customer_id>")
    def customer_loans(customer_id):
        """
        Get loans for a specific customer by ID
        - Admin: can access any customer's loans
        - Staff: can only access loans of customers they manage
        - Customer: can only access their own loans
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        from models import Loan, Customer, StaffCustomer
        
        user_role = session.get("role")
        user_id = session.get("user_id")
        
        # Authorization checks
        if user_role == "customer":
            # Customer can only view their own loans
            if user_id != customer_id:
                return {"error": "Unauthorized access"}, 403
                
        elif user_role == "staff":
            # Staff can only view loans of customers they manage
            is_managed = StaffCustomer.query.filter_by(
                staff_id=user_id, 
                customer_id=customer_id
            ).first()
            
            if not is_managed:
                return {"error": "You are not assigned to this customer"}, 403
                
        elif user_role != "admin":
            return {"error": "Invalid role"}, 403
        
        # Fetch customer and their loans
        customer = Customer.query.get(customer_id)
        if not customer:
            return {"error": "Customer not found"}, 404
        
        loans = Loan.query.filter_by(customer_id=customer_id).all()
        
        return {
            "customer": {
                "id": customer.id,
                "full_name": customer.full_name,
                "email": getattr(customer, 'email', None),
                "phone": getattr(customer, 'phone', None)
            },
            "loans": [
                {
                    "id": loan.id,
                    "amount": loan.amount,
                    "status": loan.status,
                    "amount_paid": getattr(loan, 'amount_paid', 0),
                    "interest_rate": getattr(loan, 'interest_rate', None),
                    "next_payment_date": loan.next_payment_date.strftime("%b %d, %Y") if hasattr(loan, 'next_payment_date') and loan.next_payment_date else None,
                    "created_at": loan.created_at.strftime("%b %d, %Y") if hasattr(loan, 'created_at') and loan.created_at else None,
                    "loan_term": getattr(loan, 'loan_term', None),
                    "purpose": getattr(loan, 'purpose', None)
                } for loan in loans
            ]
        }

    @app.route("/savings")
    def savings():
        """
        Role-based savings access:
        - Admin: sees ALL savings accounts
        - Staff: sees savings of customers they manage
        - Customer: sees only their own savings
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        from models import SavingsAccount, StaffCustomer
        
        user_role = session.get("role")
        user_id = session.get("user_id")
        
        if user_role == "admin":
            # Admin sees all savings
            savings_accounts = SavingsAccount.query.all()
            
        elif user_role == "staff":
            # Staff sees savings of customers they manage
            staff_customer_ids = [
                sc.customer_id for sc in StaffCustomer.query.filter_by(staff_id=user_id).all()
            ]
            savings_accounts = SavingsAccount.query.filter(
                SavingsAccount.customer_id.in_(staff_customer_ids)
            ).all()
            
        elif user_role == "customer":
            # Customer sees only their own savings
            savings_accounts = SavingsAccount.query.filter_by(customer_id=user_id).all()
            
        else:
            return {"error": "Invalid role"}, 403
        
        return {
            "savings": [
                {
                    "id": sa.id,
                    "customer_id": sa.customer_id,
                    "balance": getattr(sa, 'balance', 0),
                    "account_number": getattr(sa, 'account_number', None),
                    "account_type": getattr(sa, 'account_type', None),
                    "interest_rate": getattr(sa, 'interest_rate', None),
                    "created_at": sa.created_at.strftime("%b %d, %Y") if hasattr(sa, 'created_at') and sa.created_at else None,
                    "customer_name": sa.customer.full_name if hasattr(sa, 'customer') else None
                } for sa in savings_accounts
            ]
        }

    @app.route("/savings/<int:customer_id>")
    def customer_savings(customer_id):
        """
        Get savings for a specific customer by ID
        - Admin: can access any customer's savings
        - Staff: can only access savings of customers they manage
        - Customer: can only access their own savings
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        from models import SavingsAccount, Customer, StaffCustomer, SavingsTransaction
        from sqlalchemy import func
        
        user_role = session.get("role")
        user_id = session.get("user_id")
        
        # Authorization checks
        if user_role == "customer":
            if user_id != customer_id:
                return {"error": "Unauthorized access"}, 403
                
        elif user_role == "staff":
            is_managed = StaffCustomer.query.filter_by(
                staff_id=user_id, 
                customer_id=customer_id
            ).first()
            
            if not is_managed:
                return {"error": "You are not assigned to this customer"}, 403
                
        elif user_role != "admin":
            return {"error": "Invalid role"}, 403
        
        # Fetch customer and their savings
        customer = Customer.query.get(customer_id)
        if not customer:
            return {"error": "Customer not found"}, 404
        
        savings_accounts = SavingsAccount.query.filter_by(customer_id=customer_id).all()
        
        # Calculate total savings balance
        total_balance = sum(getattr(sa, 'balance', 0) for sa in savings_accounts)
        
        # Get recent transactions
        recent_transactions = SavingsTransaction.query.filter_by(
            customer_id=customer_id
        ).order_by(SavingsTransaction.created_at.desc()).limit(5).all()
        
        # Calculate growth (example: last month comparison)
        # This is simplified - you'd need proper date filtering
        growth_percentage = 12.0  # Placeholder
        
        return {
            "customer": {
                "id": customer.id,
                "full_name": customer.full_name,
                "email": getattr(customer, 'email', None),
                "phone": getattr(customer, 'phone', None)
            },
            "total_balance": total_balance,
            "growth_percentage": growth_percentage,
            "accounts": [
                {
                    "id": sa.id,
                    "balance": getattr(sa, 'balance', 0),
                    "account_number": getattr(sa, 'account_number', None),
                    "account_type": getattr(sa, 'account_type', None),
                    "interest_rate": getattr(sa, 'interest_rate', None),
                    "created_at": sa.created_at.strftime("%b %d, %Y") if hasattr(sa, 'created_at') and sa.created_at else None
                } for sa in savings_accounts
            ],
            "recent_transactions": [
                {
                    "id": t.id,
                    "amount": getattr(t, 'amount', 0),
                    "transaction_type": getattr(t, 'transaction_type', None),
                    "date": t.created_at.strftime("%b %d, %Y") if hasattr(t, 'created_at') and t.created_at else None,
                    "description": getattr(t, 'description', None)
                } for t in recent_transactions
            ]
        }

    @app.route("/dashboard-summary")
    def dashboard_summary():
        """
        Get dashboard summary for current user
        Returns: total savings, active loans, upcoming payments
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        from models import SavingsAccount, Loan
        from sqlalchemy import func
        
        user_id = session.get("user_id")
        user_role = session.get("role")
        
        if user_role != "customer":
            return {"error": "This endpoint is for customers only"}, 403
        
        # Get total savings
        savings_accounts = SavingsAccount.query.filter_by(customer_id=user_id).all()
        total_savings = sum(getattr(sa, 'balance', 0) for sa in savings_accounts)
        
        # Get active loans
        active_loans = Loan.query.filter_by(customer_id=user_id, status="active").all()
        total_loan_balance = sum(loan.amount for loan in active_loans)
        
        # Get first active loan for details
        active_loan = active_loans[0] if active_loans else None
        
        return {
            "total_savings": total_savings,
            "savings_growth": 12.0,  # Placeholder - calculate actual growth
            "total_loan_balance": total_loan_balance,
            "active_loan": {
                "id": active_loan.id,
                "amount": active_loan.amount,
                "amount_paid": getattr(active_loan, 'amount_paid', 0),
                "interest_rate": getattr(active_loan, 'interest_rate', None),
                "next_payment_date": active_loan.next_payment_date.strftime("%b %d, %Y") if hasattr(active_loan, 'next_payment_date') and active_loan.next_payment_date else None,
                "status": active_loan.status
            } if active_loan else None,
            "total_active_loans": len(active_loans)
        }
     
    return app