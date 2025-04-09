#!/usr/bin/env python3
# Standard library imports

# Remote library imports


from werkzeug.security import generate_password_hash , check_password_hash
from flask import jsonify, request, make_response, session
from flask_restful import Resource # type: ignore
from werkzeug.exceptions import NotFound
from flask import request , make_response
# from decorators import login_required, role_required
from models import app,db,api,Staff, StaffCustomer, Admin, Customer, SavingsTransaction, AuditLog, Loan, Repayment 


@app.route('/')
def index():
    return '<h1>Microfinance Managment System (Server Endpoint)</h1>'


@app.errorhandler(NotFound)
def handle_error(e):
    return make_response("Not found :The requested resource does not exist.", 404)


class Register(Resource):
    def get(self):
        users = Admin.query.all()
        return make_response([user.to_dict() for user in users], 200)

    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        email = data.get("email")
        role =  data.get("role")

        if not email or not password:
            return make_response({"message": "Email and password required"}, 400)
        
        existing_user = Admin.query.filter_by(email = email).first()        
        if existing_user:
            return make_response({"message": "Admin already exists"}, 400)
        
         # idea: encrypt password
        hashed_password =generate_password_hash(password)
        new_user = Admin(username=username, email=email, password=hashed_password, role=role)
       
        db.session.add(new_user)
        db.session.commit()

        return make_response({"message": "Admin created successfully",}, 201)
    
api.add_resource(Register, "/register")
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return jsonify ({"message": "Missing JSON in request"}), 400
        
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Both email and passwords are required"}), 400
        
        
        user = Admin.query.filter_by(email = email).first()
        if not user or not check_password_hash(user.password , password):
            return jsonify({"message": "Invalid credentials"}), 401
        
        session["user_id"] = user.id
        session["role"] = user.role

        return jsonify ({"Message": "Login Successful....", "role":user.role}, 200)

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
        


class UserResource(Resource):

    def get(self, id=None):
        if id == None:
            users = Admin.query.all()
            return make_response([user.to_dict() for user in users],201)
        
        user = Admin.query.filter_by(id=id).first()

        if not user:
            return make_response({"error":"Admin not found"}, 404)
        
        return make_response(user.to_dict(), 201)
   
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        user = Admin.query.get(id)

        if not user:
            return make_response({"error": "Admin not found"}, 404)
    
        user.username = data.get('username', user.name)
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        user.created_at = data.get('created_at', user.created_at)
        user.updated_at= data.get('updated_at', user.updated_at)

        db.session.commit()

        return make_response({user.to_dict()}, 200)

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
    
        staff.username = data.get('username', staff.name)
        staff.email = data.get('email', staff.email)
        staff.password = data.get('password', staff.password)
        staff.created_at = data.get('created_at', staff.created_at)
        staff.updated_at= data.get('updated_at', staff.updated_at)

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
    
        customer.name = data.get('name', customer.name)
        customer.email = data.get('email', customer.email)
        customer.phone = data.get('phone', customer.phone)
        customer.address = data.get('address', customer.address)
        customer.created_at = data.get('created_at', customer.created_at)
        customer.updated_at= data.get('updated_at', customer.updated_at)

        db.session.commit()

        return make_response({customer.to_dict()}, 200)
    
    # @login_required
    # @role_required("borrower")
    def post(self):
        data = request.get_json()

        try:
            new_customer = Customer(
               linked_user_id = data['linked_user_id'],
               fullname = data['fullname'],
               national_id = data['national_id'],
               phone = data['phone'],
               savings_balance = data['savings_balance'],
               created_at = data['created_at'] 
            )

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
    
        loan.customer_id = data.get('customer_id', loan.customer_id)
        loan.amount = data.get('amount', loan.amount)
        loan.interest_rate= data.get('interest_rate', loan.interest_rate)
        loan.status = data.get('status', loan.status)
        loan.issue_date = data.get('issue_date', loan.issue_date)
        loan.due_date= data.get('due_date', loan.due_date)

        db.session.commit()

        return make_response({loan.to_dict()}, 200)
    
    # @login_required
    # @role_required("borrower")
    def post(self):
        data = request.get_json()

        try:
            new_loan = Loan(
                customer_id = data['customer_id'],
                amount = data['amount'],
                interest_rate = data['interest_rate'],
                status = data['status'],
                issue_date = data['issue_date'],
                due_date = data['due_data']
            )

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
            new_rep = Repayment(
                loan_id = data['loan_id'],
                amount = data['amount'],
                date_paid = data['date_paid']
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
            new_st = SavingsTransaction(
                customer_id = data['customer_id'],
                deposit = data['deposit'],
                withdrawal = data['withdrawal'],
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

api.add_resource(UserResource, "/admins")
api.add_resource(StaffResource, "/staff")
api.add_resource(CustomerResource, "/customers")
api.add_resource(StaffCustomerResource, "/staff-customers")
api.add_resource(LoanResource, "/loans")
api.add_resource(RepaymentResource, "/repayments")
api.add_resource(SavingsTransactionResource, "/savings-transactions")
api.add_resource(AuditLogResource, "/audit-logs")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, "/login")




if __name__ == '__main__':
    app.run(port=5555, debug=True)