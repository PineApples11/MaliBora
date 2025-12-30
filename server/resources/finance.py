from flask_restful import Resource
from flask import request, make_response
from datetime import datetime

from models import db, Repayment, SavingsTransaction, Customer
from decorators import login_required, role_required


class Finance(Resource):

    @login_required
    @role_required("admin", "staff")
    def get(self, id=None):
        if id is None:
            repayments = Repayment.query.all()
            return make_response([r.to_dict() for r in repayments], 200)

        repayment = Repayment.query.get(id)
        if not repayment:
            return make_response({"error": "Repayment not found"}, 404)

        return make_response(repayment.to_dict(), 200)

    @login_required
    @role_required("admin", "staff")
    def post(self):
        data = request.get_json()

        if not Customer.query.get(data["customer_id"]):
            return make_response({"error": "Customer not found"}, 404)

        repayment = Repayment(
            customer_id=data["customer_id"],
            amount=data["amount"],
            date_paid=datetime.strptime(
                data["date_paid"], "%Y-%m-%d %H:%M:%S"
            ),
        )

        db.session.add(repayment)
        db.session.commit()
        return make_response(repayment.to_dict(), 201)


class SavingsTransactionResource(Resource):

    @login_required
    @role_required("admin", "staff")
    def get(self, id=None):
        if id is None:
            txns = SavingsTransaction.query.all()
            return make_response([t.to_dict() for t in txns], 200)

        txn = SavingsTransaction.query.get(id)
        if not txn:
            return make_response({"error": "Transaction not found"}, 404)

        return make_response(txn.to_dict(), 200)

    @login_required
    @role_required("admin", "staff")
    def post(self):
        data = request.get_json()

        if not Customer.query.get(data["customer_id"]):
            return make_response({"error": "Customer not found"}, 404)

        txn = SavingsTransaction(
            customer_id=data["customer_id"],
            type=data["type"],
            amount=data["amount"],
            transaction_date=datetime.strptime(
                data["transaction_date"], "%Y-%m-%d %H:%M:%S"
            ),
        )

        db.session.add(txn)
        db.session.commit()
        return make_response(txn.to_dict(), 201)
