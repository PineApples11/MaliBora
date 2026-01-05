from flask import Flask, session
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

    app.config.update(
        SESSION_COOKIE_NAME="session",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SECURE=False,
        SESSION_COOKIE_SAMESITE="Lax",
    )

    # Init extensions
    db.init_app(app)
    api.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    CORS(app,
         supports_credentials=True,
         origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5175",
            "http://127.0.0.1:5175"
         ],
         allow_headers=["Content-Type"],
         methods=["GET","POST","OPTIONS"]
    )

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
                "loans": [{"loan_id": l.id, "amount": l.principal_amount, "status": l.status} for l in customer.loans]
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

    @app.route("/list-staff")
    def list_staff():
        from models import Staff
        return {"staff": [s.full_name for s in Staff.query.all()]}

    @app.route("/me", methods=["GET"])
    def me():
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401

        return {
            "id": session["user_id"],
            "role": session["role"],
            "full_name": session["full_name"]
        }, 200
    

    @app.route("/recent-repayments")
    def recent_repayments():
        """
        Get recent repayment transactions
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        try:
            from models import Repayment
            repayments = (

                Repayment.query
                .order_by(Repayment.date_paid.desc())
                .limit(10)
                .all()
            )
            result = []
            from models import Loan, Customer
            for repayment in repayments:
                loan=Loan.query.get(repayment.loan_id)
                customer_name = None
                if loan and loan.customer_id:
                    customer = Customer.query.get(loan.customer_id)

                result.append({
                    "id": repayment.id,
                    "amount": repayment.amount,
                    "date": repayment.date_paid.strftime("%b %d, %Y") if repayment.date_paid else None,
                    "loan_id": repayment.loan_id,
                    "customer_name": customer.full_name if customer else None
                })
            return {"recent_repayments": result},200
        except Exception as e:
            print(f"Recent repayments error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Server error: {str(e)}"}, 500

           
           
    
    @app.route("/staff-dashboard-stats")
    def staff_dashboard_stats():
        """
        Get dashboard statistics for staff users
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        try:
            from models import StaffCustomer, Loan
            user_id = session.get("user_id")
            
            # Get number of assigned customers
            assigned_customers_count = StaffCustomer.query.filter_by(staff_id=user_id).count()
            
            # Get number of loans for assigned customers
            assigned_customer_ids = [
                sc.customer_id for sc in StaffCustomer.query.filter_by(staff_id=user_id).all()
            ]
            loans_count = Loan.query.filter(Loan.customer_id.in_(assigned_customer_ids)).count()
            
            return {
                "assigned_customers_count": assigned_customers_count,
                "loans_count": loans_count
            }
        except Exception as e:
            print(f"Staff dashboard stats error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Server error: {str(e)}"}, 500

    
    @app.route("/loans")
    def loans():
        """
        Role-based loan access:
        - Admin: sees ALL loans
        - Staff: sees loans of customers they manage
        - Customer: sees only their own loans
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        try:
            from models import Loan, StaffCustomer, Repayment
            from sqlalchemy import func
            
            user_role = session.get("role")
            user_id = session.get("user_id")
            
            if user_role == "admin":
                loans = Loan.query.all()
            elif user_role == "staff":
                staff_customer_ids = [
                    sc.customer_id for sc in StaffCustomer.query.filter_by(staff_id=user_id).all()
                ]
                loans = Loan.query.filter(Loan.customer_id.in_(staff_customer_ids)).all()
            elif user_role == "customer":
                loans = Loan.query.filter_by(customer_id=user_id).all()
            else:
                return {"error": "Invalid role"}, 403
            
            result = []
            for loan in loans:
                try:
                    # Calculate total amount paid from repayments
                    total_paid = db.session.query(func.sum(Repayment.amount)).filter_by(loan_id=loan.id).scalar() or 0
                    
                    # Calculate total amount (principal + interest)
                    total_amount = loan.principal_amount * (1 + (loan.interest_rate / 100))
                    
                    # Safely format dates
                    issued_date = None
                    if hasattr(loan, 'issued_date') and loan.issued_date:
                        try:
                            issued_date = loan.issued_date.strftime("%b %d, %Y")
                        except:
                            issued_date = str(loan.issued_date)
                    
                    due_date = None
                    if hasattr(loan, 'due_date') and loan.due_date:
                        try:
                            due_date = loan.due_date.strftime("%b %d, %Y")
                        except:
                            due_date = str(loan.due_date)
                    
                    created_at = None
                    if hasattr(loan, 'created_at') and loan.created_at:
                        try:
                            created_at = loan.created_at.strftime("%b %d, %Y")
                        except:
                            created_at = str(loan.created_at)
                    
                    customer_name = None
                    if hasattr(loan, 'customer') and loan.customer:
                        customer_name = loan.customer.full_name
                    
                    result.append({
                        "id": loan.id,
                        "amount": loan.principal_amount,
                        "total_amount": round(total_amount, 2),
                        "amount_paid": round(total_paid, 2),
                        "remaining_balance": round(total_amount - total_paid, 2),
                        "status": loan.status,
                        "customer_id": loan.customer_id,
                        "interest_rate": loan.interest_rate,
                        "loan_term_months": loan.loan_term_months,
                        "issued_date": issued_date,
                        "due_date": due_date,
                        "created_at": created_at,
                        "customer_name": customer_name
                    })
                except Exception as loan_error:
                    print(f"Error processing loan {loan.id}: {loan_error}")
                    continue
            
            return {"loans": result}
        except Exception as e:
            print(f"Loans endpoint error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Server error: {str(e)}"}, 500
    
    @app.route("/savings/<int:customer_id>")
    def customer_savings(customer_id):
            """
            Get savings transactions for a specific customer by ID
            """
            if "user_id" not in session:
                return {"error": "Not authenticated"}, 401

            try:
                from models import SavingsTransaction, Customer, StaffCustomer

                user_role = session.get("role")
                user_id = session.get("user_id")

                # Authorization checks
                if user_role == "customer":
                    if user_id != customer_id:
                        return {"error": "Unauthorized access"}, 403
                elif user_role == "staff":
                    is_managed = StaffCustomer.query.filter_by(
                        staff_id=user_id,
                        customer_id=customer_id
                    ).first()
                    if not is_managed:
                        return {"error": "You are not assigned to this customer"}, 403
                elif user_role != "admin":
                    return {"error": "Invalid role"}, 403

                customer = Customer.query.get(customer_id)
                if not customer:
                    return {"error": "Customer not found"}, 404

                transactions = SavingsTransaction.query.filter_by(customer_id=customer_id).all()

                result = []
                for tx in transactions:
                    try:
                        # Safely format the date
                        tx_date = None
                        if hasattr(tx, 'date') and tx.date:
                            try:
                                tx_date = tx.date.strftime("%b %d, %Y")
                            except Exception as date_err:
                                print(f"Warning: Could not format date for transaction {tx.id}: {date_err}")
                                tx_date = str(tx.date)

                        result.append({
                            "id": tx.id,
                            "amount": tx.amount,
                            "transaction_type": tx.transaction_type,
                            "date": tx_date,
                            "description": tx.description
                        })
                    except Exception as tx_err:
                        print(f"Warning: Error processing transaction {tx.id}: {tx_err}")
                        import traceback
                        traceback.print_exc()
                        continue

                return {
                    "customer": {
                        "id": customer.id,
                        "full_name": customer.full_name,
                        "phone": getattr(customer, "phone", None),
                        "national_id": getattr(customer, "national_id", None)
                    },
                    "savings_transactions": result
                }

            except Exception as e:
                print(f"Customer savings endpoint error: {e}")
                import traceback
                traceback.print_exc()
                return {"error": f"Server error: {str(e)}"}, 500


    @app.route("/transactions/<int:customer_id>", methods=["GET"])
    def customer_transactions(customer_id):
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        try:
            from models import SavingsTransaction, Customer, StaffCustomer
            from datetime import datetime

            user_role = session.get("role")
            user_id = session.get("user_id")

            # Authorization checks
            if user_role == "customer":
                if user_id != customer_id:
                    return {"error": "Unauthorized access"}, 403
            elif user_role == "staff":
                is_managed = StaffCustomer.query.filter_by(
                    staff_id=user_id,
                    customer_id=customer_id
                ).first()
                if not is_managed:
                    return {"error": "You are not assigned to this customer"}, 403
            elif user_role != "admin":
                return {"error": "Invalid role"}, 403

            customer = Customer.query.get(customer_id)
            if not customer:
                return {"error": "Customer not found"}, 404

            transactions = SavingsTransaction.query.filter_by(customer_id=customer_id).all()

            result = []
            for tx in transactions:
                try:
                    # Safely format the date
                    tx_date = None
                    if hasattr(tx, 'date') and tx.date:
                        try:
                            # Check if it's already a datetime object
                            if isinstance(tx.date, datetime):
                                tx_date = tx.date.strftime("%b %d, %Y")
                            elif isinstance(tx.date, str):
                                tx_date = tx.date
                            else:
                                tx_date = str(tx.date)
                        except Exception as date_err:
                            print(f"Warning: Could not format date for transaction {tx.id}: {date_err}")
                            tx_date = str(tx.date) if tx.date else None

                    result.append({
                        "id": tx.id,
                        "amount": float(tx.amount) if tx.amount else 0.0,
                        "transaction_type": tx.transaction_type if hasattr(tx, 'transaction_type') else "unknown",
                        "date": tx_date,
                        "description": tx.description if hasattr(tx, 'description') else ""
                    })
                except Exception as tx_err:
                    print(f"Warning: Error processing transaction {tx.id}: {tx_err}")
                    import traceback
                    traceback.print_exc()
                    continue

            return {
                "customer": {
                    "id": customer.id,
                    "full_name": customer.full_name,
                    "phone": getattr(customer, "phone", None),
                    "national_id": getattr(customer, "national_id", None)
                },
                "savings_transactions": result
            }
        except Exception as e:
            print(f"Customer transactions error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Server error: {str(e)}"}, 500

    @app.route("/loans/<int:customer_id>")
    def customer_loans(customer_id):
        """
        Get loans for a specific customer by ID
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        try:
            from models import Loan, Customer, StaffCustomer, Repayment
            from sqlalchemy import func
            
            user_role = session.get("role")
            user_id = session.get("user_id")
            
            # Authorization checks
            if user_role == "customer":
                if user_id != customer_id:
                    return {"error": "Unauthorized access"}, 403
            elif user_role == "staff":
                is_managed = StaffCustomer.query.filter_by(
                    staff_id=user_id, 
                    customer_id=customer_id
                ).first()
                if not is_managed:
                    return {"error": "You are not assigned to this customer"}, 403
            elif user_role != "admin":
                return {"error": "Invalid role"}, 403
            
            customer = Customer.query.get(customer_id)
            if not customer:
                return {"error": "Customer not found"}, 404
            
            loans = Loan.query.filter_by(customer_id=customer_id).all()
            
            result = []
            for loan in loans:
                try:
                    total_paid = db.session.query(func.sum(Repayment.amount)).filter_by(loan_id=loan.id).scalar() or 0
                    total_amount = loan.principal_amount * (1 + (loan.interest_rate / 100))
                    
                    # Safely format dates
                    issued_date = None
                    if hasattr(loan, 'issued_date') and loan.issued_date:
                        try:
                            issued_date = loan.issued_date.strftime("%b %d, %Y")
                        except:
                            issued_date = str(loan.issued_date)
                    
                    due_date = None
                    if hasattr(loan, 'due_date') and loan.due_date:
                        try:
                            due_date = loan.due_date.strftime("%b %d, %Y")
                        except:
                            due_date = str(loan.due_date)
                    
                    created_at = None
                    if hasattr(loan, 'created_at') and loan.created_at:
                        try:
                            created_at = loan.created_at.strftime("%b %d, %Y")
                        except:
                            created_at = str(loan.created_at)
                    
                    result.append({
                        "id": loan.id,
                        "amount": loan.principal_amount,
                        "total_amount": round(total_amount, 2),
                        "amount_paid": round(total_paid, 2),
                        "remaining_balance": round(total_amount - total_paid, 2),
                        "status": loan.status,
                        "interest_rate": loan.interest_rate,
                        "loan_term_months": loan.loan_term_months,
                        "issued_date": issued_date,
                        "due_date": due_date,
                        "created_at": created_at
                    })
                except Exception as loan_error:
                    print(f"Error processing loan {loan.id}: {loan_error}")
                    import traceback
                    traceback.print_exc()
                    continue
            
            return {
                "customer": {
                    "id": customer.id,
                    "full_name": customer.full_name,
                    "phone": customer.phone,
                    "national_id": customer.national_id
                },
                "loans": result
            }
        except Exception as e:
            print(f"Customer loans error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Server error: {str(e)}"}, 500

    @app.route("/dashboard-summary")
    def dashboard_summary():
        """
        Get dashboard summary for current user
        """
        if "user_id" not in session:
            return {"error": "Not authenticated"}, 401
        
        try:
            from models import Loan, SavingsAccount, Repayment
            from sqlalchemy import func
            
            user_id = session.get("user_id")
            user_role = session.get("role")
            
            if user_role != "customer":
                return {"error": "This endpoint is for customers only"}, 403
            
            # Get total savings
            total_savings = 0
            try:
                savings_accounts = SavingsAccount.query.filter_by(customer_id=user_id).all()
                total_savings = sum(sa.balance for sa in savings_accounts)
            except Exception as e:
                print(f"Error fetching savings: {e}")
            
            # Get active loans (approved status)
            active_loans = Loan.query.filter_by(customer_id=user_id, status="approved").all()
            
            # Calculate total loan balance
            total_loan_balance = 0
            for loan in active_loans:
                total_amount = loan.principal_amount * (1 + (loan.interest_rate / 100))
                total_paid = db.session.query(func.sum(Repayment.amount)).filter_by(loan_id=loan.id).scalar() or 0
                total_loan_balance += (total_amount - total_paid)
            
            # Get first active loan for details
            active_loan = None
            if active_loans:
                loan = active_loans[0]
                total_paid = db.session.query(func.sum(Repayment.amount)).filter_by(loan_id=loan.id).scalar() or 0
                total_amount = loan.principal_amount * (1 + (loan.interest_rate / 100))
                
                active_loan = {
                    "id": loan.id,
                    "amount": loan.principal_amount,
                    "total_amount": round(total_amount, 2),
                    "amount_paid": round(total_paid, 2),
                    "remaining_balance": round(total_amount - total_paid, 2),
                    "interest_rate": loan.interest_rate,
                    "due_date": loan.due_date.strftime("%b %d, %Y") if loan.due_date else None,
                    "status": loan.status
                }
            
            return {
                "total_savings": round(total_savings, 2),
                "savings_growth": 12.0,
                "total_loan_balance": round(total_loan_balance, 2),
                "active_loan": active_loan,
                "total_active_loans": len(active_loans)
            }
        except Exception as e:
            print(f"Dashboard summary error: {e}")
            import traceback
            traceback.print_exc()
            return {"error": f"Server error: {str(e)}"}, 500
     
    return app