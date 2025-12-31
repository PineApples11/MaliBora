from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
api = Api()
bcrypt = Bcrypt()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Config
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = "super-secret-key"

    # Init extensions
    db.init_app(app)
    api.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    CORS(app, supports_credentials=True, origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ])

    # Import resources
    from resources.auth import Login, Logout, CheckSession, CurrentCustomer
    from resources.admin import AdminResource
    from resources.staff import StaffResource
    from resources.customer import CustomerResource
    from resources.loan import LoanResource
    from resources.finance import Finance, SavingsTransactionResource
    from resources.audit import AuditLogResource

    # Add API resources
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

    # Regular Flask routes
    @app.route("/")
    def index():
        return {"message": "Malibora API running"}

    @app.route("/test-data")
    def test_data():
        from models import Admin, Customer
        admins_count = Admin.query.count()
        customers_count = Customer.query.count()
        return {"admins": admins_count, "customers": customers_count}

    @app.route("/customers-loans")
    def customers_loans():
        from models import Customer
        result = []
        for customer in Customer.query.all():
            result.append({
                "customer_id": customer.id,
                "name": customer.full_name,
                "loans": [{"loan_id": l.id, "amount": l.amount, "status": l.status} for l in customer.loans]
            })
        return {"data": result}

    @app.route("/staff-customers")
    def staff_customers():
        from models import Staff
        result = []
        for staff in Staff.query.all():
            result.append({
                "staff_id": staff.id,
                "name": staff.full_name,
                "assigned_customers": [
                    {"customer_id": sc.customer.id, "name": sc.customer.full_name, "notes": sc.notes} 
                    for sc in staff.staff_customers
                ]
            })
        return {"data": result}
    
    @app.route("/list-customers")
    def list_customers():
        from models import Customer
        return {
            "customers": [
                {"id": c.id, "full_name": c.full_name } 
                for c in Customer.query.all()
        ]
    }


    return app
