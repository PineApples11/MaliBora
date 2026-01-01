from flask_restful import Resource
from flask import request, session, make_response
from sqlalchemy import func
from models import Admin, Staff, Customer
from decorators import login_required, role_required


class Login(Resource):
    def post(self):
        # 1️⃣ Parse JSON safely
        data = request.get_json() or {}

        username = (data.get("username") or "").strip()
        password = data.get("password") or ""
        role = (data.get("role") or "").lower()

        # 2️⃣ Validate required fields
        if not username or not password or role not in ["admin", "staff", "customer"]:
            return make_response({"error": "Missing or invalid fields"}, 400)

        print(f"💡 Login attempt - Role: {role}, Username: '{username}'")

        # 3️⃣ Map role to model
        model_map = {
            "admin": Admin,
            "staff": Staff,
            "customer": Customer
        }
        Model = model_map[role]

        # 4️⃣ Lookup user in DB
        if role == "admin":
            user = Model.query.filter_by(username=username).first()
        else:
            user = Model.query.filter(func.lower(Model.full_name) == username.lower()).first()

        if not user:
            print("❌ User not found")
            return make_response({"error": "Invalid credentials"}, 401)

        if not user.check_password(password):
            print("❌ Invalid password")
            return make_response({"error": "Invalid credentials"}, 401)

        # 5️⃣ Save session
        session["user_id"] = user.id
        session["role"] = role
        session["full_name"] = user.full_name

        print(f"✅ Login successful for {username} ({role})")
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
        if not user:
            return make_response({"error": "User not found"}, 404)

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