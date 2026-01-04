#!/usr/bin/env python3

from random import randint, choice as rc
from datetime import datetime, timedelta

from app import app, db
from models import Admin, Customer, Loan, Repayment, SavingsTransaction, Staff, StaffCustomer, AuditLog, SavingsAccount

from faker import Faker

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("🌱 Starting seed...")

        # Clear existing data
        db.session.query(Repayment).delete()
        db.session.query(Loan).delete()
        db.session.query(StaffCustomer).delete()
        db.session.query(SavingsTransaction).delete()
        db.session.query(SavingsAccount).delete()
        db.session.query(Customer).delete()
        db.session.query(Staff).delete()
        db.session.query(AuditLog).delete()
        db.session.query(Admin).delete()
        db.session.commit()
        print("✅ Cleared old data")

        # Create Admins
        admins = []
        for i in range(5):
            admin = Admin(
                username=fake.name(),
                email=fake.email(),
            )
            admin.set_password("Password123!")
            db.session.add(admin)
            admins.append(admin)
        db.session.commit()
        print("✅ Added admins")

        # Create Customers and Savings Accounts
        customers = []
        savings_accounts = []
        for i in range(25):
            customer = Customer(
                admin_id=rc(admins).id,
                full_name=fake.name(),
                national_id=f"ID{i+1}",
                phone=fake.phone_number(),
                savings_balance=round(randint(100, 5000), 2),
            )
            customer.set_password("Customer123!")
            db.session.add(customer)
            customers.append(customer)
            db.session.commit()  # Need ID for foreign key

            # Create savings account for customer
            account = SavingsAccount(
                customer_id=customer.id,
                account_number=f"SA{1000 + i}",
                balance=customer.savings_balance,
                interest_rate=rc([1.0, 1.5, 2.0]),
                status=rc(['active', 'inactive']),
                created_at=datetime.now()
            )
            db.session.add(account)
            savings_accounts.append(account)
        db.session.commit()
        print("✅ Added customers and savings accounts")

        # Create Loans
        loans = []
        for i in range(20):
            customer = rc(customers)
            loan_term = rc([1, 3, 6])  # months
            created_at = datetime.now()
            due_date = created_at + timedelta(days=loan_term * 30)
            loan = Loan(
                customer_id=customer.id,
                principal_amount=round(randint(500, 5000), 2),
                interest_rate=rc([5.0, 7.5, 10.0]),
                loan_term_months=loan_term,
                status=rc(["approved", "pending", "rejected"]),
                created_at=created_at,
                issued_date=created_at,
                due_date=due_date
            )
            db.session.add(loan)
            loans.append(loan)
        db.session.commit()
        print("✅ Added loans")

        # Create Repayments
        for loan in loans:
            for _ in range(2):
                repayment = Repayment(
                    customer_id=loan.customer_id,
                    loan_id=loan.id,
                    amount=round(randint(100, int(loan.principal_amount)), 2),
                    date_paid=datetime.now() - timedelta(days=randint(1, 30)),
                    payment_method=rc(['cash', 'mpesa', 'bank transfer'])
                )
                db.session.add(repayment)
        db.session.commit()
        print("✅ Added repayments")

        # Create Savings Transactions
        for account in savings_accounts:
            for _ in range(3):
                transaction = SavingsTransaction(
                    account_id=account.id,
                    customer_id=account.customer_id,
                    transaction_type=rc(['deposit', 'withdrawal']),
                    amount=round(randint(100, 1000), 2),
                    reference=fake.uuid4(),
                    created_at=datetime.now() - timedelta(days=randint(1, 30))
                )
                db.session.add(transaction)
        db.session.commit()
        print("✅ Added savings transactions")

        # Create Staff
        staff = []
        for i in range(10):
            staff_member = Staff(
                full_name=fake.name(),
                email=fake.email(),
                created_at=datetime.now(),
                admin_id=rc(admins).id
            )
            staff_member.set_password("Staff123!")
            db.session.add(staff_member)
            staff.append(staff_member)
        db.session.commit()
        print("✅ Added staff")

        # Create Staff-Customer Relationships
        for staff_member in staff:
            for customer in customers[:2]:
                staff_customer = StaffCustomer(
                    staff_id=staff_member.id,
                    customer_id=customer.id,
                    assigned_at=datetime.now(),
                    notes=f"Assigned to {customer.full_name}"
                )
                db.session.add(staff_customer)
        db.session.commit()
        print("✅ Added staff-customer relationships")

        # Create Audit Logs
        for admin in admins:
            for _ in range(2):
                audit_log = AuditLog(
                    admin_id=admin.id,
                    action=rc(['created loan', 'updated profile', 'deleted record']),
                    timestamp=datetime.now() - timedelta(days=randint(1, 30))
                )
                db.session.add(audit_log)
        db.session.commit()
        print("✅ Added audit logs")

        print("🌟 Seeding complete!")
