from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.ext.associationproxy import association_proxy
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import MetaData

# from config import db
app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db = SQLAlchemy(app)

migrate = Migrate(app, db)

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-customer.user','-audit_logs.user',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'staff', 'borrower'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='user', uselist=False)
    audit_logs = db.relationship('AuditLog', back_populates='user')

class Customer(db.Model,SerializerMixin):
    __tablename__ = 'customers'
    serialize_rules = ('-savings_transactions.customer', '-staff_customers.customer',
                        '-user.customer', '-loans.customer',)
    
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

class Staff(db.Model, SerializerMixin):
    __tablename__ = 'staff'
    serialize_rules = ('-staff_customers.staff',)
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'staff', etc.
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    staff_customers = db.relationship('StaffCustomer', back_populates='staff')

class StaffCustomer(db.Model, SerializerMixin):
    __tablename__ = 'staff_customers'
    serialize_rules = ('-staff.staff_customers', '-customer.staff_customers',)

    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    notes = db.Column(db.String(200), nullable=True)

    staff = db.relationship('Staff', back_populates='staff_customers')
    customer = db.relationship('Customer', back_populates='staff_customers')

class Loan(db.Model,SerializerMixin): 
    __tablename__ = 'loans'
    serialize_rules = ('-customer.loans', '-repayments.loan',)

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # 'pending', 'approved', 'rejected'
    issued_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    due_date = db.Column(db.DateTime, nullable=False)

    customer = db.relationship('Customer', back_populates='loans')
    repayments = db.relationship('Repayment', back_populates='loan')

class Repayment(db.Model, SerializerMixin): 
    __tablename__ = 'repayments'
    serialize_rules = ('-loan.repayments',)

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_paid = db.Column(db.DateTime, default=db.func.current_timestamp())

    loan = db.relationship('Loan', back_populates='repayments')

class SavingsTransaction(db.Model, SerializerMixin):
    __tablename__ = 'savings_transactions'
    serialize_rules = ('-customer.savings_transactions',)

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'deposit' or 'withdrawal'
    amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='savings_transactions')

class AuditLog(db.Model, SerializerMixin):
    __tablename__ = 'audit_logs'
    serialize_rules = ('-user.audit_logs',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='audit_logs')