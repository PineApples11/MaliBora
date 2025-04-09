#!/usr/bin/env python3

from random import randint, choice as rc
from datetime import datetime, timedelta

from app import app, db
from models import User, Customer, Loan, Repayment, SavingsTransaction, Staff, StaffCustomer, AuditLog

if __name__ == '__main__':
    with app.app_context():
        print(" Starting seed...")

        # Clear existing data
        db.session.query(Repayment).delete()
        db.session.query(Loan).delete()
        db.session.query(StaffCustomer).delete()
        db.session.query(SavingsTransaction).delete()
        db.session.query(Customer).delete()
        db.session.query(Staff).delete()
        db.session.query(AuditLog).delete()
        db.session.query(User).delete()

        db.session.commit()

        # Create Users
        users = []
        for i in range(5):
            user = User(
                username=f"user{i}",
                email=f"user{i}@example.com",
                password="password123",
                role=rc(["admin", "staff", "borrower"])
            )
            db.session.add(user)
            users.append(user)

        db.session.commit()  #  Commit users so their IDs exist

        # Create Customers
        customers = []
        for i in range(5):
            customer = Customer(
                linked_user_id=rc(users).id,
                full_name=f"Customer {i}",
                national_id=f"ID{i}",
                phone=f"123456789{i}",
                savings_balance=round(randint(100, 5000), 2),
            )
            db.session.add(customer)
            customers.append(customer)

        db.session.commit()

        # Create Loans
        loans = []
        for i in range(5):
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

        # Create Repayments
        for loan in loans:
            for i in range(5):
                repayment = Repayment(
                    loan_id=loan.id,
                    amount=round(loan.amount / 2, 2),
                    date_paid=datetime.now() - timedelta(days=randint(1, 30)),
                )
                db.session.add(repayment)

        db.session.commit()

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

        # Create Staff
        staff = []
        for i in range(2):

            staff_member = Staff(full_name=f"Staff {i}",
                                 email=f'{i}@gmail.com', password='xxxx', role='staff', created_at=datetime.now()
                                 )

            db.session.add(staff_member)
            staff.append(staff_member)

        db.session.commit()

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

        # Create Audit Logs
        for user in users:
            for _ in range(2):
                audit_log = AuditLog(
                    user_id=user.id,
                    action=rc(['created loan', 'updated profile', 'deleted record']),
                    timestamp=datetime.now() - timedelta(days=randint(1, 30)),
                )
                db.session.add(audit_log)

        db.session.commit()


        print("Done seeding!")

