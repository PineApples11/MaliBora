from flask_restful import Resource
from flask import request, make_response
from datetime import datetime

from models import db, Loan, Customer
from decorators import login_required, role_required


class LoanResource(Resource):

    @login_required
    @role_required("admin", "staff")
    def get(self, id=None):
        if id is None:
            loans = Loan.query.all()
            return make_response([l.to_dict() for l in loans], 200)

        loan = Loan.query.get(id)
        if not loan:
            return make_response({"error": "Loan not found"}, 404)

        return make_response(loan.to_dict(), 200)

    @login_required
    @role_required("admin", "staff")
    def post(self):
        data = request.get_json()

        if not Customer.query.get(data["customer_id"]):
            return make_response({"error": "Customer not found"}, 404)

        loan = Loan(
            customer_id=data["customer_id"],
            amount=data["amount"],
            interest_rate=data["interest_rate"],
            status=data["status"],
            issued_date=datetime.strptime(
                data["issued_date"], "%Y-%m-%d %H:%M:%S"
            ),
            due_date=datetime.strptime(
                data["due_date"], "%Y-%m-%d %H:%M:%S"
            ),
        )

        db.session.add(loan)
        db.session.commit()
        return make_response(loan.to_dict(), 201)

    @login_required
    @role_required("admin", "staff")
    def put(self, id):
        loan = Loan.query.get(id)
        if not loan:
            return make_response({"error": "Loan not found"}, 404)

        data = request.get_json()

        loan.amount = data.get("amount", loan.amount)
        loan.interest_rate = data.get("interest_rate", loan.interest_rate)
        loan.status = data.get("status", loan.status)

        db.session.commit()
        return make_response(loan.to_dict(), 200)
