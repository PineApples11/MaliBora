#!/usr/bin/env python3

from random import randint, choice as rc
from datetime import datetime, timedelta

from app import app, db
from models import Admin, Customer, Loan, Repayment, SavingsTransaction, Staff, StaffCustomer, AuditLog

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
        db.session.query(Customer).delete()
        db.session.query(Staff).delete()
        db.session.query(AuditLog).delete()
        db.session.query(Admin).delete()

        db.session.commit()
        print("completes deleting")

        # Create Users
        admins = []
        for i in range(5):
            admin = Admin(
                username=fake.name(),
                email=fake.email(),
            )
            admin.set_password(fake.password())
            db.session.add(admin)
            admins.append(admin)

        db.session.commit()  # 🔑 Commit users so their IDs exist
        print("completes adding admins")

        # Create Customers
        customers = []
        for i in range(30):
            customer = Customer(
                admin_id=rc(admins).id,
                full_name=fake.name(),
                national_id=f"ID{i}",
                phone=fake.phone_number(),
                savings_balance=round(randint(100, 5000), 2),
            )
            customer.set_password(fake.password())
            db.session.add(customer)
            customers.append(customer)

        db.session.commit()
        print("completes adding customers")

        # Create Loans
        loans = []
        for i in range(20):
            customer = rc(customers)
            loan = Loan(
                customer_id=customer.id,
                amount=round(randint(500, 5000), 2),
                interest_rate=rc([5.0, 7.5, 10.0]),
                status=rc(["approved", "pending", "rejected"]),
                issued_date=datetime.now(),
                due_date=datetime.now() + timedelta(days=rc([30, 60, 90])),
            )
            db.session.add(loan)
            loans.append(loan)

        db.session.commit()
        print("completes adding loans")

        # Create Repayments
        for customer in customers:
            for i in range(2):
                repayment = Repayment(
                    customer_id=customer.id,
                    amount=round(loan.amount / 2, 2),
                    date_paid=datetime.now() - timedelta(days=randint(1, 30)),
                )
                db.session.add(repayment)

        db.session.commit()
        print("completes adding repayments")

        # Create Savings Transactions
        for customer in customers:
            for _ in range(3):
                transaction = SavingsTransaction(
                    customer_id=customer.id,
                    type=rc(['deposit', 'withdrawal']),
                    amount=round(randint(100, 1000), 2),
                    transaction_date=datetime.now() - timedelta(days=randint(1, 30)),
                )
                db.session.add(transaction)

        db.session.commit()
        print("completes adding saving transactions")

        # Create Staff
        staff = []
        for i in range(10):

            staff_member = Staff(full_name=fake.name(),
                                 email=fake.email(), created_at=datetime.now(), admin_id=rc(admins).id
                                 )
            staff_member.set_password(fake.password())
            db.session.add(staff_member)
            staff.append(staff_member)

        db.session.commit()
        print("completes adding staff")

        # Create Staff-Customer Relationships
        for staff_member in staff:
            for customer in customers[:2]:
                staff_customer = StaffCustomer(
                    staff_id=staff_member.id,
                    customer_id=customer.id,
                    assigned_at=datetime.now(),
                    notes=f"Assigned to {customer.full_name}",
                )
                db.session.add(staff_customer)

        db.session.commit()
        print("completes adding staff customer")

        # Create Audit Logs
        for admin in admins:
            for _ in range(2):
                audit_log = AuditLog(
                    admin_id=admin.id,
                    action=rc(['created loan', 'updated profile', 'deleted record']),
                    timestamp=datetime.now() - timedelta(days=randint(1, 30)),
                )
                db.session.add(audit_log)

        db.session.commit()
        print("completes adding audit logs")


        print("✅ Done seeding!")