from flask_restful import Resource
from flask import request, session, make_response
from sqlalchemy import func
from models import Admin, Staff, Customer
from decorators import login_required, role_required


class Login(Resource):
    def post(self):
        data = request.get_json()

        username = data.get("username", "").strip()
        password = data.get("password", "")
        role = data.get("role", "").lower()

        print(f"💡 Login attempt - Role: {role}, Username: '{username}', Password: '{password}'")

        model_map = {
            "admin": Admin,
            "staff": Staff,
            "customer": Customer
        }

        Model = model_map.get(role)
        if not Model:
            print("❌ Invalid role provided")
            return make_response({"error": "Invalid role"}, 400)

        # Lookup user
        if role == "admin":
            user = Model.query.filter_by(username=username).first()
        else:
            # Case-insensitive lookup for staff and customers
            user = Model.query.filter(func.lower(Model.full_name) == username.lower()).first()

        print("User from DB:", user)
        if user:
            print("Password valid?", user.check_password(password))

        if not user or not user.check_password(password):
            return make_response({"error": "Invalid credentials"}, 401)

        # Save session
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
        role = session.get("role")
        user_id = session.get("user_id")

        model_map = {
            "admin": Admin,
            "staff": Staff,
            "customer": Customer
        }

        Model = model_map.get(role)
        if not Model:
            return make_response({"error": "Invalid session"}, 401)

        user = Model.query.get(user_id)
        return make_response(user.to_dict(), 200)


class CurrentCustomer(Resource):
    @login_required
    @role_required("customer")
    def get(self):
        user_id = session.get("user_id")
        customer = Customer.query.get(user_id)

        if not customer:
            return make_response({"error": "Customer not found"}, 404)

        return make_response(customer.to_dict(), 200)
