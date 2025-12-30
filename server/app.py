from config import create_app, api
from resources.auth import Login, Logout, CheckSession, CurrentCustomer
from resources.admin import AdminResource
from resources.staff import StaffResource
from resources.customer import CustomerResource
from resources.loan import LoanResource
from resources.finance import Finance,SavingsTransactionResource
from resources.audit import AuditLogResource

app = create_app()

@app.route("/")
def index():
    return {"message": "Malibora API running"}

api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check-session")
api.add_resource(CurrentCustomer, "/current-customer")


api.add_resource(AdminResource, "/admin", "/admin/<int:id>")
api.add_resource(StaffResource, "/staff", "/staff/<int:id>")
api.add_resource(CustomerResource, "/customer", "/customer/<int:id>")
api.add_resource(LoanResource, "/loan", "/loan/<int:id>")


api.add_resource(Finance, "/repayment", "/repayment/<int:id>")
api.add_resource(SavingsTransactionResource, "/savings-transaction", "/savings-transaction/<int:id>")


api.add_resource(AuditLogResource, "/audit-log", "/audit-log/<int:id>")

if __name__ == "__main__":
    app.run(debug=True, port=5555)
