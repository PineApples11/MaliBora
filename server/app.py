from models import db,api,Staff, StaffCustomer, Admin, Customer, SavingsTransaction, AuditLog, Loan, Repayment, app

from flask import request, make_response, session
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from flask import request
from flask_restful import Resource
from datetime import datetime
from decorators import login_required, role_required
from flask_cors import CORS

CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

@app.errorhandler(NotFound)
def handle_error(e):
    return make_response("Not found :The requested resource does not exist.", 404)

class RegisterAdmin(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username and not password:
            return make_response({"message": "Username and password required"}, 400)
        
        existing_admin = Admin.query.filter_by(username = username).first()        
        if existing_admin:
            return make_response({"message": "Admin already exists"}, 400)
        
        new_user = Admin(username = username)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return make_response({"message": "User created successfully",}, 201)
    
api.add_resource(RegisterAdmin, "/register-admin")

class RegisterCustomer(Resource):

    def post(self):
        data = request.get_json()
        print(data)

        admin_id = data['admin_id']
        exists = Admin.query.filter_by(id=admin_id).first()
        if not exists:
            return make_response({"error": "Admin id does not exist"}, 404)
        
        try:
            created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")

        try:
            new_customer = Customer(
               admin_id = admin_id,
               full_name = data['full_name'],
               national_id = data['national_id'],
               phone = data['phone'],
               savings_balance = data['savings_balance'],
               created_at = created_at
            )
            password = data["password_hash"]
            new_customer.set_password(password)
            print(new_customer.to_dict())

            db.session.add(new_customer)
            db.session.commit()

            return make_response(new_customer.to_dict(), 201)
        
        except Exception as e:
            print("Error:", e)
            return  make_response({"error":"Bad Request"}, 400)
    
api.add_resource(RegisterCustomer, "/register-customer")

class RegisterStaff(Resource):
    # @login_required
    # @role_required("admin")
    def post(self):
        data = request.get_json()

        admin_id = data['admin_id']
        exists = Admin.query.filter_by(id=admin_id).first()
        if not exists:
            return make_response({"error": "Admin id does not exist"}, 404)
        
        try:
            created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")

        try:
            new_staff = Staff(
               admin_id = admin_id,
               full_name = data['full_name'],
               email = data['email'],
               created_at = created_at
            )
            password = data["password_hash"]
            new_staff.set_password(password)

            db.session.add(new_staff)
            db.session.commit()

            return make_response(new_staff.to_dict(), 201)
        
        except:
            return  make_response({"error":"Bad Request"}, 400)
    
api.add_resource(RegisterStaff, "/register-staff")
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        print(data)

        username = data.get("full_name")
        password = data.get("password")  
        role = data.get("role")

        if role == "admin":
            user = Admin.query.filter_by(username=username).first()
        elif role == "staff":
            user = Staff.query.filter_by(full_name=username).first()
        elif role == "customer":
            print("responds")
            user = Customer.query.filter_by(full_name=username).first()
        else:
            return make_response({"error": "Invalid role"}, 401)

        if not user or not user.check_password(password):
            return make_response({"error": "Invalid credentials"}, 401)

        session["user_id"] = user.id
        session["role"] = role

        return make_response({"Message": "Login Successful"}, 201)


class Logout(Resource):
        def post(self):
            session.pop("user_id", None)
            session.pop("role", None)
            return make_response({"message": "Successfully Logged Out"}, 201)

class CheckSession(Resource):

    def get(self):
        role = session.get("role")

        if role == 'admin':
            user = Admin.query.filter(Admin.id == session.get('user_id')).first()
        elif role == 'staff':
            user = Staff.query.filter(Staff.id == session.get('user_id')).first()
        elif role == 'customer':
            user = Customer.query.filter(Customer.id == session.get('user_id')).first()
        else:
            return make_response({'error': '401: Not Authorized'}, 401)
        
        return make_response(user.to_dict(), 201)
        


class AdminResource(Resource):
    def get(self, id=None):
        if id == None:
            admins = Admin.query.all()
            return make_response([admin.to_dict() for admin in admins],201)
        
        admin = Admin.query.filter_by(id=id).first()

        if not admin:
            return make_response({"error":"Admin not found"}, 404)
        
        return make_response(admin.to_dict(), 201)
   
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        admin = Admin.query.get(id)

        if not admin:
            return make_response({"error": "User not found"}, 404)
        
        try:
            created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")        

        password = data.get('password_hash', admin.password_hash)
        admin.set_password(password)

        admin.username = data.get('username', admin.username)
        admin.email = data.get('email', admin.email)
        admin.created_at = created_at

        db.session.commit()

        return make_response({admin.to_dict()}, 200)

class StaffResource(Resource):

    def get(self, id=None):
        if id == None:
            staffs = Staff.query.all()
            return make_response([staff.to_dict() for staff in staffs],201)
        
        staff = Staff.query.filter_by(id=id).first()

        if not staff:
            return make_response({"error":"Staff not found"}, 404)
        
        return make_response(staff.to_dict(), 201)
   
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        staff = Staff.query.get(id)
        if not staff:
            return make_response({"error": "Staff not found"}, 404)
        
        admins_id = [admin.id for admin in Admin.query.all()]
        admin_id = data['admin_id']
        if admin_id not in admins_id:
            return make_response({"error":"Admin id does not exist"},404)
            
        try:
            created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")        

        staff.full_name = data.get('username', staff.name)
        staff.email = data.get('email', staff.email)
        staff.created_at = created_at
        staff.admin_id = data.get('admin_id', staff.admin_id)

        password = data.get('password_hash', staff.password_hash)
        staff.set_password(password)

        db.session.commit()

        return make_response({staff.to_dict()}, 200)

class CustomerResource(Resource):
    def get(self, id=None):
        if id == None:
            customers = Customer.query.all()
            return make_response([customer.to_dict() for customer in customers],201)
        
        customer = Customer.query.filter_by(id=id).first()

        if not customer:
            return make_response({"error":"Customer not found"}, 404)
        
        return make_response(customer.to_dict(), 201)
    
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)

        customer = Customer.query.get(id)
        if not customer:
            return make_response({"error": "Customer not found"}, 404)
  
        admins_id = [admin.id for admin in Admin.query.all()]
        admin_id = data['admin_id']
        if admin_id not in admins_id:
            return make_response({"error":"Admin id does not exist"},404)
                    
        try:
            created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")
    
        customer.full_name = data.get('name', customer.full_name)
        customer.national_id = data.get('name', customer.national_id)
        customer.phone = data.get('phone', customer.phone)
        customer.savings_balance= data.get('savings_balance', customer.savings_balance)
        customer.created_at = created_at
        customer.admin_id = data.get('admin_id', customer.admin_id)

        password = data.get('password_hash', customer.password_hash)
        customer.set_password(password)

        db.session.commit()

        return make_response({customer.to_dict()}, 200)


class StaffCustomerResource(Resource):
    def get(self, id=None):
        if id == None:
            staff_customers = StaffCustomer.query.all()
            return make_response([sc.to_dict() for sc in staff_customers],201)
        
        sc = StaffCustomer.query.filter_by(id=id).first()

        if not sc:
            return make_response({"error":"StaffCustomer not found"}, 404)
        
        return make_response(sc.to_dict(), 201)
    

class LoanResource(Resource):
    def get(self, id=None):
        if id == None:
            loans = Loan.query.all()
            return make_response([loan.to_dict() for loan in loans],201)
        
        loan = Loan.query.filter_by(id=id).first()

        if not loan:
            return make_response({"error":"Loan not found"}, 404)
        
        return make_response(loan.to_dict(), 201)
    
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        loan = Loan.query.get(id)
        if not loan:
            return make_response({"error": "Loan not found"}, 404)
        
        customer_id = data['customer_id']
        exists = Customer.query.filter_by(id=customer_id).first()
        if not exists:
            return make_response({"error": "Customer id does not exist"}, 404)
        
        valid_status = ["pending", "approved", "rejected"]
        status = data['status']
        if status not in valid_status:
            return make_response({"error": "Status is not pending, approved or rejected"}, 404)
        
        try:
            issue_date = datetime.strptime(data['issued_date'], "%Y-%m-%d %H:%M:%S")
            due_date = datetime.strptime(data['due_date'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong date format")
    
        loan.customer_id = data.get('customer_id', loan.customer_id)
        loan.amount = data.get('amount', loan.amount)
        loan.interest_rate= data.get('interest_rate', loan.interest_rate)
        loan.status = data.get('status', loan.status)
        loan.issue_date = issue_date
        loan.due_date= due_date

        db.session.commit()

        return make_response({"message": "Put works! Trust"}, 200)
    
    # @login_required
    # @role_required("borrower")
    def post(self):
        data = request.get_json()

        valid_status = ["pending", "approved", "rejected"]
        status = data['status']
        if status not in valid_status:
            return make_response({"error": "Status is not pending, approved or rejected"}, 404)
        
        customer_id = data['customer_id']
        exists = Customer.query.filter_by(id=customer_id).first()
        if not exists:
            return make_response({"error": "Customer id does not exist"}, 404)

        try:
            issue_date = datetime.strptime(data['issued_date'], "%Y-%m-%d %H:%M:%S")
            due_date = datetime.strptime(data['due_date'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates format")        

        try:
            new_loan = Loan(
                customer_id = data['customer_id'],
                amount = data['amount'],
                interest_rate = data['interest_rate'],
                status = data['status'],
                issued_date = issue_date,
                due_date = due_date
            )
            print(new_loan)

            db.session.add(new_loan)
            db.session.commit()

            return make_response(new_loan.to_dict(), 201)
        
        except:
            return  make_response({"error":"Bad Request"}, 400) 
    

class RepaymentResource(Resource):
    def get(self, id=None):
        if id == None:
            repayments = Repayment.query.all()
            return make_response([repayment.to_dict() for repayment in repayments],201)
        
        repayment = Repayment.query.filter_by(id=id).first()

        if not repayment:
            return make_response({"error":"Repayment not found"}, 404)
        
        return make_response(repayment.to_dict(), 201)
    
    def post(self):
        data = request.get_json()
    
        customer_id = data['customer_id']
        exists = Customer.query.filter_by(id=customer_id).first()
        if not exists:
            return make_response({"error": "Customer id does not exist"}, 404)

        try:
            date_paid = datetime.strptime(data['date_paid'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")        

        try:
            new_rep = Repayment(
                customer_id = customer_id,
                amount = data['amount'],
                date_paid = date_paid
            )

            db.session.add(new_rep)
            db.session.commit()

            return make_response(new_rep.to_dict(), 201)
        
        except:
            return  make_response({"error":"Bad Request"}, 400) 
    

class SavingsTransactionResource(Resource):
    def get(self, id=None):
        if id == None:
            savings_transactions = SavingsTransaction.query.all()
            return make_response([st.to_dict() for st in savings_transactions],201)
        
        st = SavingsTransaction.query.filter_by(id=id).first()

        if not st:
            return make_response({"error":"Savings Transaction not found"}, 404)
        
        return make_response(st.to_dict(), 201)
    
    def post(self):
        data = request.get_json()
    
        customer_id = data['customer_id']
        exists = Customer.query.filter_by(id=customer_id).first()
        if not exists:
            return make_response({"error": "Customer id does not exist"}, 404)

        try:
            transaction_date = datetime.strptime(data['transaction_date'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")

        try:
            new_st = SavingsTransaction(
                customer_id = customer_id,
                type = data['type'],
                amount = data['amount'],
                transaction_date = transaction_date
            )

            db.session.add(new_st)
            db.session.commit()

            return make_response(new_st.to_dict(), 201)
        
        except:
            return  make_response({"error":"Bad Request"}, 400) 
    

class AuditLogResource(Resource):
    def get(self, id=None):
        if id is None:
            audit_logs = AuditLog.query.all()
            return make_response([al.to_dict() for al in audit_logs],201)
        
        al = AuditLog.query.filter_by(id=id).first()

        if not al:
            return make_response({"error":"Audit log not found"}, 404)
        
        return make_response(al.to_dict(), 201)

class CurrentCustomer(Resource):
    def get(self):
        if session.get("role") != "customer":
            return make_response({"error": "Unauthorized"}, 401)

        user_id = session.get("user_id")
        customer = Customer.query.get(user_id)
        if not customer:
            return make_response({"error": "Customer not found"}, 404)

        return make_response(customer.to_dict(), 200)

class LoginCustomer(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        role = data.get("role")

        if role == "admin":
            user = Admin.query.filter_by(username = username).first()
        elif role == "staff":
            user = Staff.query.filter_by(full_name = username).first()
        elif role == "customer":
            user = Customer.query.filter_by(full_name = username).first()
        else:
            return make_response({"error": "Invalid role"}, 401)


        if not user or not user.check_password(password):
             return make_response({"error": "Invalid credentials"}, 401)
        
        session["user_id"] = user.id
        session["role"] = role

        return make_response ({"Message": "Login Successful"}, 201)


app.register_error_handler(404, handle_error)
api.add_resource(AdminResource, "/admin", "/admin/<int:id>")
api.add_resource(StaffResource, "/staff", "/staff/<int:id>")
api.add_resource(CustomerResource, "/customer", "/customer/<int:id>")
api.add_resource(StaffCustomerResource, "/staff-customer", "/staff-customer/<int:id>")
api.add_resource(LoanResource, "/loan", "/loan/<int:id>")
api.add_resource(RepaymentResource, "/repayment", "/repayment/<int:id>")
api.add_resource(SavingsTransactionResource, "/savings-transaction", "/savings-transaction/<int:id>")
api.add_resource(AuditLogResource, "/audit-log", "/audit-log/<int:id>")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, "/login")
api.add_resource(LoginCustomer, "/login-customer")
api.add_resource(CurrentCustomer, "/current-customer")





if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(port=5555, debug=True)