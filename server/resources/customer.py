from flask_restful import Resource
from flask import request, make_response
from datetime import datetime

from models import db, Customer, Admin
from decorators import login_required, role_required


class CustomerResource(Resource):

    @login_required
    @role_required("admin", "staff")
    def get(self, id=None):
        if id is None:
            customers = Customer.query.all()
            return make_response([c.to_dict() for c in customers], 200)

        customer = Customer.query.get(id)
        if not customer:
            return make_response({"error": "Customer not found"}, 404)

        return make_response(customer.to_dict(), 200)

    @login_required
    @role_required("admin", "staff")
    def put(self, id):
        customer = Customer.query.get(id)
        if not customer:
            return make_response({"error": "Customer not found"}, 404)

        data = request.get_json()

        if "admin_id" in data and not Admin.query.get(data["admin_id"]):
            return make_response({"error": "Admin does not exist"}, 404)

        customer.full_name = data.get("full_name", customer.full_name)
        customer.phone = data.get("phone", customer.phone)
        customer.savings_balance = data.get(
            "savings_balance", customer.savings_balance
        )
        customer.admin_id = data.get("admin_id", customer.admin_id)

        if "password" in data:
            customer.set_password(data["password"])

        if "created_at" in data:
            customer.created_at = datetime.strptime(
                data["created_at"], "%Y-%m-%d %H:%M:%S"
            )

        db.session.commit()
        return make_response(customer.to_dict(), 200)

    @login_required
    @role_required("admin")
    def delete(self, id):
        customer = Customer.query.get(id)
        if not customer:
            return make_response({"error": "Customer not found"}, 404)

        db.session.delete(customer)
        db.session.commit()
        return make_response({"message": "Customer deleted"}, 200)
