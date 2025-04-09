from sqlalchemy_serializer import SerializerMixin # type: ignore
from flask import Flask
from flask_cors import CORS # type: ignore
from flask_migrate import Migrate # type: ignore
from flask_restful import Api # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from sqlalchemy.orm import validates
import re
# from sqlalchemy import MetaData

# from config import db
app = Flask(__name__)
app.secret_key = 'super secret key'
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
    password = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin', 'staff', 'borrower'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='user', uselist=False)
    audit_logs = db.relationship('AuditLog', back_populates='user')

    @validates('email') 
    def validate_email(self, key, email):
        if '@' not in email:
            raise AssertionError('Email is not valid')
        return email
    
    @validates('username')
    def validate_username(self, key, username):
        if len(username) < 3:
            raise AssertionError('Username must be at least 3 characters long')
        return username
    @validates('password')
    def validate_password(self, key, password):
        if len(password) < 5:
            raise AssertionError('Password must be at least 6 characters long')
        if not re.search(r'[A-Z]', password):
            raise AssertionError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password):
            raise AssertionError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', password):
            raise AssertionError('Password must contain at least one digit')
        if not re.search(r'[@$!%*?&]', password):
            raise AssertionError('Password must contain at least one special character')
        if re.search(r'\s', password):
            raise AssertionError('Password must not contain any spaces')
        return password
    



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

    @validates('phone')
    def validate_phone(self, key, phone):
        if not phone.isdigit():
            raise AssertionError('Phone number must be numeric')
        if len(phone) > 15: 
            raise AssertionError('Phone number must be at most 15 digits long')
        if len(phone) < 10:
            raise AssertionError('Phone number must be at least 10 digits long')
        return phone
    @validates('national_id')
    def validate_national_id(self, key, national_id):
        if not national_id.isdigit():
            raise AssertionError('National ID must be numeric')
        if len(national_id) > 11:
            raise AssertionError('National ID must be at most 11 digits long')
        if len(national_id) < 5:
            raise AssertionError('National ID must be at least 5 characters long')
        return national_id
    @validates('full_name')
    def validate_full_name(self, key, full_name):
        if len(full_name) < 3:
            raise AssertionError('Full name must be at least 3 characters long')
        return full_name
    


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

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise AssertionError('Email is not valid')
        return email @validates('password')
    def validate_password(self, key, password):
        if len(password) < 5:
            raise AssertionError('Password must be at least 6 characters long')
        if not re.search(r'[A-Z]', password):
            raise AssertionError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password):
            raise AssertionError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', password):
            raise AssertionError('Password must contain at least one digit')
        if not re.search(r'[@$!%*?&]', password):
            raise AssertionError('Password must contain at least one special character')
        if re.search(r'\s', password):
            raise AssertionError('Password must not contain any spaces')
        return password
    
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