from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'staff', 'borrower'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='user', uselist=False)
    audit_logs = db.relationship('AuditLog', back_populates='user')

class Customer(db.Model):
    __tablename__ = 'customers'
    id = db.Column(db.Integer, primary_key=True)
    linked_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(80), nullable=False)
    national_id = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    savings_balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='customer')
    loans = db.relationship('Loan', back_populates='customer')
    savings_transactions = db.relationship('SavingsTransaction', back_populates='customer')
    staff_customers = db.relationship('StaffCustomer', back_populates='customer')


class StaffCustomer(db.Model):
    __tablename__ = 'staff_customers'
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    notes = db.Column(db.String(200), nullable=True)

    staff = db.relationship('Staff', back_populates='staff_customers')
    customer = db.relationship('Customer', back_populates='staff_customers')

class Loan(db.Model): 
    __tablename__ = 'loans'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'pending', 'approved', 'rejected'
    issued_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    due_date = db.Column(db.DateTime, nullable=False)

    customer = db.relationship('Customer', back_populates='loans')
    repayments = db.relationship('Repayment', back_populates='loan')

class Repayment(db.Model): 
    __tablename__ = 'repayments'
    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_paid = db.Column(db.DateTime, default=db.func.current_timestamp())

    loan = db.relationship('Loan', back_populates='repayments')

class SavingsTransaction(db.Model):
    __tablename__ = 'savings_transactions'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'deposit' or 'withdrawal'
    amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='savings_transactions')

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='audit_logs')
