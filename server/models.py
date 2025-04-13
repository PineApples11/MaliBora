from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

# Association Models

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'customer', 'staff', 'admin'

    customer = db.relationship('Customer', back_populates='user', uselist=False)
    admin = db.relationship('Admin', back_populates='user', uselist=False)

    def set_password(self, password):
        self.password_hash = password

    def check_password(self, password):
        return self.password_hash == password

    def get_id(self):
        return str(self.id)

# Role-based profiles

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    savings_account = db.relationship('SavingsAccount', uselist=False, back_populates='customer')
    loans = db.relationship('Loan', back_populates='customer', lazy=True)
    user = db.relationship('User', back_populates='customer')
    transactions=db.relationship('Transaction',back_populates='customer' ,uselist=True)





class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    user = db.relationship('User', back_populates='admin')
    loan_approvals = db.relationship('LoanApproval', back_populates='admin')
# Savings Account

class SavingsAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    balance = db.Column(db.Float, nullable=False, default=0.0)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), unique=True)

    customer = db.relationship('Customer', back_populates='savings_account')

    def deposit(self, amount, reference=None):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        
        # Create a new deposit transaction
        transaction = Transaction(
            amount=amount,
            transaction_type='deposit',
            customer=self.customer,
            reference=reference
        )
        
        self.balance += amount
        db.session.add(transaction)
        db.session.commit()
        return transaction

    # In SavingsAccount class
    def withdraw(self, amount, reference=None):
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive.")
        transaction = Transaction(
            amount=amount,
            transaction_type='withdrawal',
            status='pending',  # Set status to pending
            customer=self.customer,
            reference=reference
        )
    
        db.session.add(transaction)
        db.session.commit()
        return transaction


# Loans

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    loan_duration = db.Column(db.Integer, nullable=False)  # in months
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected, repaid
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    
    customer = db.relationship('Customer', back_populates='loans', lazy=True)
    repayments = db.relationship('Repayment', back_populates='loan', lazy=True)
    approvals = db.relationship('LoanApproval', back_populates='loan', lazy=True)
    def approve_loan(self,user):
        if user.role !='admin':
            raise PermissionError("Only admin can approve loans.")
        self.status = 'approved'
        approval = LoanApproval(admin=user.admin, loan=self, action='approved')
        db.session.add(approval)


    def reject_loan(self, user):
        if user.role != 'admin':
            raise PermissionError("Only admin can reject loans.")  # Correct error message
        self.status = 'rejected'
        approval = LoanApproval(admin=user.admin, loan=self, action='rejected')
        db.session.add(approval)

    def add_repayment(self, customer, amount, method=None, ref=None):
        if self.customer_id != customer.id:
            raise PermissionError("This customer does not own the loan.")
        if self.status != 'approved':
            raise ValueError("Cannot repay a loan that is not approved.")

        repayment = Repayment(
            loan_id=self.id,
            customer=customer,
            amount=amount,
            payment_method=method,
            reference=ref
        )
        db.session.add(repayment)

        total_repaid = sum(r.amount for r in self.repayments) + amount
        total_due = self.amount * (1 + self.interest_rate / 100)

        if total_repaid >= total_due:
            self.status = 'repaid'

        db.session.commit()
        return repayment

# Loan settings (editable by Admin only)

class LoanApproval(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    loan_id = db.Column(db.Integer, db.ForeignKey('loan.id'), nullable=False)
    action = db.Column(db.String(10), nullable=False)  # 'approved' or 'rejected'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship('Admin', back_populates='loan_approvals')
    loan = db.relationship('Loan', back_populates='approvals')


class LoanSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    default_interest_rate = db.Column(db.Float, nullable=False)




class Repayment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    loan_id = db.Column(db.Integer, db.ForeignKey('loan.id'), nullable=False)

    loan=db.relationship('Loan',back_populates='repayments')

    # Optional: who made the payment
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    customer = db.relationship('Customer', back_populates='repayments')

    # Optional: transaction reference or method (bank, transfer, etc.)
    payment_method = db.Column(db.String(50))
    reference = db.Column(db.String(100))

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)  # 'deposit' or 'withdrawal'
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign key linking the transaction to a customer
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    customer = db.relationship('Customer', back_populates='transactions', lazy=True)
    
    # Optional reference for the transaction (e.g., payment reference, withdrawal ID, etc.)
    reference = db.Column(db.String(100))

    def approve(self):
        self.status = 'approved'
    
    def reject(self):
        self.status = 'rejected'

    def __repr__(self):
        return f'<Transaction {self.id}, {self.transaction_type}, {self.amount}, {self.status}>'