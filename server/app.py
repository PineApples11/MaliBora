#!/usr/bin/env python3
# Standard library imports

# Remote library imports



from flask import request, make_response, session
from flask_restful import Resource
from werkzeug.exceptions import NotFound
from flask import request
from flask_restful import Resource
from datetime import datetime
# from decorators import login_required, role_required

# from models import app,db,api

from models import app,db,api,Staff, StaffCustomer, Admin, Customer, SavingsTransaction, AuditLog, Loan, Repayment


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


@app.errorhandler(NotFound)
def handle_error(e):
    return make_response("Not found :The requested resource does not exist.", 404)

#idea handle register/login based on roles
class Register(Resource):
    def get(self):
        admins = Admin.query.all()
        return make_response([admin.to_dict() for admin in admins], 201)

    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        role =  data.get("role")

        if not username and not password:
            return make_response({"message": "Username and password required"}, 400)
        
        existing_admin = Admin.query.filter_by(username = username).first()        
        if existing_admin:
            return make_response({"message": "Admin already exists"}, 400)
        
        new_user = Admin(username = username)
        new_user(password) # idea: encrypt password
        db.session.add(new_user)
        db.session.commit()

        return make_response({"message": "User created successfully",}, 201)
    
api.add_resource(Register, "/register")
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = Admin.query.filter_by(username = username).first()
        
        #idea: encrypt password
        # if not user or not user.check_password(password):
        #      return {"message": "Invalid credentials"}, 401
        
        session["user_id"] = user.id
        session["role"] = user.role

        return make_response ({"Message": "Login Successful"}, 201)

class Logout(Resource):
        def post(self):
            session.pop("user_id", None)
            return make_response({"message": "Successfully Logged Out"}, 201)

class CheckSession(Resource):

    def get(self):
        user = Admin.query.filter(Admin.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return make_response({'message': '401: Not Authorized'}, 401)
        


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
    
        admin.username = data.get('username', admin.username)
        admin.email = data.get('email', admin.email)
        admin.password = data.get('password', admin.password)
        admin.created_at = created_at

        db.session.commit()

        return make_response({admin.to_dict()}, 200)

class StaffResource(Resource):

    def get(self, id=None):
        if id == None:
            staffs = Staff.query.all()
            print(staffs)
            return make_response([staff.to_dict() for staff in staffs],201)
        
        staff = Staff.query.filter_by(id=id).first()

        if not staff:
            return make_response({"error":"Staff not found"}, 404)
        
        return make_response(staff.to_dict(only=("email")), 201)
   
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        staff = Staff.query.get(id)

        if not staff:
            return make_response({"error": "Staff not found"}, 404)
        
        try:
            created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")        
    
        staff.full_name = data.get('username', staff.name)
        staff.email = data.get('email', staff.email)
        staff.password = data.get('password', staff.password)
        staff.created_at = created_at
        staff.admin_id = data.get('admin_id', staff.admin_id)


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
        
        return make_response(customer.to_dict(only=('id', 'linked_user_id', 'full_name')), 201)
    
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        customer = Customer.query.get(id)

        if not customer:
            return make_response({"error": "Customer not found"}, 404)
        
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

        db.session.commit()

        return make_response({customer.to_dict()}, 200)
    
    # @login_required
    # @role_required("borrower")
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
            new_customer = Customer(
               admin_id = data['admin_id'],
               full_name = data['full_name'],
               national_id = data['national_id'],
               phone = data['phone'],
               savings_balance = data['savings_balance'],
               created_at = created_at
            )
            print(new_customer)

            db.session.add(new_customer)
            db.session.commit()

            return make_response(new_customer.to_dict(), 201)
        
        except:
            return  make_response({"error":"Bad Request"}, 400)


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
        
        try:
            issue_date = datetime.strptime(data['issue_date'], "%Y-%m-%d %H:%M:%S")
            due_date = datetime.strptime(data['due_date'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")
    
        loan.customer_id = data.get('customer_id', loan.customer_id)
        loan.amount = data.get('amount', loan.amount)
        loan.interest_rate= data.get('interest_rate', loan.interest_rate)
        loan.status = data.get('status', loan.status)
        loan.issue_date = issue_date
        loan.due_date= due_date

        db.session.commit()

        return make_response({loan.to_dict()}, 200)
    
    # @login_required
    # @role_required("borrower")
    def post(self):
        data = request.get_json()

        try:
            issue_date = datetime.strptime(data['issue_date'], "%Y-%m-%d %H:%M:%S")
            due_date = datetime.strptime(data['due_date'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")        

        print(data)

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

        try:
            date_paid = datetime.strptime(data['date_paid'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")        

        try:
            new_rep = Repayment(
                customer_id = data['customer_id'],
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

        try:
            transaction_date = datetime.strptime(data['transaction_date'], "%Y-%m-%d %H:%M:%S")
        except:
            raise ValueError("wrong dates")

        try:
            new_st = SavingsTransaction(
                customer_id = data['customer_id'],
                type = data['type'],
                amount = data['amount'],
                transaction_date = data['transaction_date']
            )

            db.session.add(new_st)
            db.session.commit()

            return make_response(new_st.to_dict(), 201)
        
        except:
            return  make_response({"error":"Bad Request"}, 400) 
    

class AuditLogResource(Resource):
    def get(self, id=None):
        if id == None:
            audit_logs = AuditLog.query.all()
            return make_response([al.to_dict() for al in audit_logs],201)
        
        al = AuditLog.query.filter_by(id=id).first()

        if not al:
            return make_response({"error":"Audit log not found"}, 404)
        
        return make_response(al.to_dict(), 201)


app.register_error_handler(404, handle_error)
api.add_resource(AdminResource, "/admin")
api.add_resource(StaffResource, "/staff")
api.add_resource(CustomerResource, "/customer")
api.add_resource(StaffCustomerResource, "/staff-customer")
api.add_resource(LoanResource, "/loan")
api.add_resource(RepaymentResource, "/repayment")
api.add_resource(SavingsTransactionResource, "/savings-transaction")
api.add_resource(AuditLogResource, "/audit-log")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, "/login")




if __name__ == '__main__':
    app.run(port=5555, debug=True)