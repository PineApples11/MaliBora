#!/usr/bin/env python3

# Standard library imports
from flask import Flask, request, make_response, session
from flask_restful import Resource, Api
from werkzeug.exceptions import NotFound

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
from decorators import login_required, role_required

# Add your model imports
from models import db, migrate, User, Customer, StaffCustomer, Loan, Repayment, AuditLog


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///malibora.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate.init_app(app, db)
api = Api(app)

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


@app.errorhandler(NotFound)
def handle_error(e):
    return make_response("Not found :The requested resource does not exist.", 404)


class Register(Resource):
    def get(self):
        users = User.query.all()
        return make_response([user.to_dict() for user in users], 201)

    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        role =  data.get("role")

        if not username and not password:
            return make_response({"message": "Username and password required"}, 400)
        
        existing_user = User.query.filter_by(username = username).first()        
        if existing_user:
            return make_response({"message": "User already exists"}, 400)
        
        new_user = User(username = username)
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

        user = User.query.filter_by(username = username).first()
        
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
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return make_response({'message': '401: Not Authorized'}, 401)
        


class User(Resource):

    def get(self, id=None):
        if id == None:
            users = User.query.all()
            return make_response([user.to_dict() for user in users],201)
        
        user = User.query.filter_by(id=id).first()

        if not user:
            return make_response({"error":"User not found"}, 404)
        
        return make_response(user.to_dict(), 201)
   
    def put(self,id):
        data = request.get_json()

        if not data:
            return make_response({"error":"Invalid request"}, 400)
        
        user = User.query.get(id)

        if not user:
            return make_response({"error": "User not found"}, 404)
    
        user.username = data.get('username', user.name)
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        user.created_at = data.get('created_at', user.created_at)
        user.updated_at= data.get('updated_at', user.updated_at)

        db.session.commit()

        return make_response({user.to_dict()}, 200)


class Customer(Resource):
    def get(self, id=None):
        if id == None:
            customers = Customer.query.all()
            return make_response([customer.to_dict() for customer in customers],201)
        
        customer = Customer.query.filter_by(id=id).first()

        if not customer:
            return make_response({"error":"User not found"}, 404)
        
        return make_response(customer.to_dict(), 201)
    
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
    
    @login_required
    @role_required("borrower")
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


# class StaffCustomer(Resource):
#     def get(self, id=None):
#         if id == None:
#             staff_customers = StaffCustomer.query.all()
#             return make_response([sc.to_dict() for sc in staff_customers],201)
        
#         sc = StaffCustomer.query.filter_by(id=id).first()

#         if not sc:
#             return make_response({"error":"User not found"}, 404)
        
#         return make_response(sc.to_dict(), 201)
    

class Loan(Resource):
    def get(self, id=None):
        if id == None:
            loans = Loan.query.all()
            return make_response([loan.to_dict() for loan in loans],201)
        
        loan = Loan.query.filter_by(id=id).first()

        if not loan:
            return make_response({"error":"User not found"}, 404)
        
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
    

class Repayment(Resource):
    def get(self, id=None):
        if id == None:
            repayments = Repayment.query.all()
            return make_response([repayment.to_dict() for repayment in repayments],201)
        
        repayment = Repayment.query.filter_by(id=id).first()

        if not repayment:
            return make_response({"error":"User not found"}, 404)
        
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
    

class SavingsTransaction(Resource):
    def get(self, id=None):
        if id == None:
            savings_transactions = SavingsTransaction.query.all()
            return make_response([st.to_dict() for st in savings_transactions],201)
        
        st = SavingsTransaction.query.filter_by(id=id).first()

        if not st:
            return make_response({"error":"User not found"}, 404)
        
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
    

class AuditLog(Resource):
    def get(self, id=None):
        if id == None:
            audit_logs = AuditLog.query.all()
            return make_response([al.to_dict() for al in audit_logs],201)
        
        al = AuditLog.query.filter_by(id=id).first()

        if not al:
            return make_response({"error":"User not found"}, 404)
        
        return make_response(al.to_dict(), 201)


app.register_error_handler(404, handle_error)
api.add_resource(User, "/users")
api.add_resource(Customer, "/customers")
api.add_resource(StaffCustomer, "/staff-customers")
api.add_resource(Loan, "/loans")
api.add_resource(Repayment, "/repayments")
api.add_resource(SavingsTransaction, "/savings-transactions")
api.add_resource(AuditLog, "/audit-logs")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, "/login")




if __name__ == '__main__':
    app.run(port=5555, debug=True)