from flask_restful import Resource
from flask import request, session, make_response
from models import Admin, Staff, Customer
from decorators import login_required, role_required


class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")
        role = data.get("role")

        model_map = {
            "admin": Admin,
            "staff": Staff,
            "customer": Customer
        }

        Model = model_map.get(role)
        if not Model:
            return make_response({"error": "Invalid role"}, 400)

        user = Model.query.filter_by(
            username=username if role == "admin" else "full_name"
        ).first()

        if not user or not user.check_password(password):
            return make_response({"error": "Invalid credentials"}, 401)

        session["user_id"] = user.id
        session["role"] = role

        return make_response({"message": "Login successful"}, 200)


class Logout(Resource):
    @login_required
    def post(self):
        session.clear()
        return make_response({"message": "Logged out"}, 200)

class CheckSession(Resource):
    @login_required
    def get(self):
        role = session["role"]
        user_id = session["user_id"]

        model_map = {
            "admin": Admin,
            "staff": Staff,
            "customer": Customer
        }

        user = model_map[role].query.get(user_id)
        return make_response(user.to_dict(), 200)
    
class CurrentCustomer(Resource):

    @login_required
    @role_required("customer")
    def get(self):
        if session.get("role") != "customer":
            return make_response({"error": "Unauthorized"}, 401)

        user_id = session.get("user_id")
        customer = Customer.query.get(user_id)
        if not customer:
            return make_response({"error": "Customer not found"}, 404)

        return make_response(customer.to_dict(), 200)