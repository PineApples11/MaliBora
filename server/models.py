from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
import re

app = Flask(__name__)
app.secret_key = 'super secret key'
CORS(app)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# ---------------------------- Models ---------------------------- #

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    serialize_rules = ('-customer.admin', '-audit_logs.admin', '-staff.admin',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='admin', cascade='all, delete')
    audit_logs = db.relationship('AuditLog', back_populates='admin')
    staff = db.relationship('Staff', back_populates='admin')

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
            raise AssertionError('Must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password):
            raise AssertionError('Must contain at least one lowercase letter')
        if not re.search(r'[0-9]', password):
            raise AssertionError('Must contain at least one digit')
        if not re.search(r'[@$!%*?&]', password):
            raise AssertionError('Must contain at least one special character')
        if re.search(r'\s', password):
            raise AssertionError('Password must not contain spaces')
        return password


class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'
    serialize_rules = ('-savings_transactions.customer', '-staff_customers.customer',
                       '-admin.customer', '-loans.customer',)

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    full_name = db.Column(db.String(80), nullable=False)
    national_id = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    savings_balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    admin = db.relationship('Admin', back_populates='customer')
    loans = db.relationship('Loan', back_populates='customer')
    savings_transactions = db.relationship('SavingsTransaction', back_populates='customer')
    staff_customers = db.relationship('StaffCustomer', back_populates='customer')

    @validates('phone')
    def validate_phone(self, key, phone):
        if not phone.isdigit():
            raise AssertionError('Phone number must be numeric')
        if not (10 <= len(phone) <= 15):
            raise AssertionError('Phone number must be between 10 and 15 digits')
        return phone

    @validates('national_id')
    def validate_national_id(self, key, national_id):
        if not national_id.isdigit():
            raise AssertionError('National ID must be numeric')
        if not (5 <= len(national_id) <= 11):
            raise AssertionError('National ID must be between 5 and 11 digits')
        return national_id

    @validates('full_name')
    def validate_full_name(self, key, full_name):
        if len(full_name) < 3:
            raise AssertionError('Full name must be at least 3 characters long')
        return full_name


class Staff(db.Model, SerializerMixin):
    __tablename__ = 'staff'
    serialize_rules = ('-staff_customers.staff', '-admin.staff',)

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)

    admin = db.relationship('Admin', back_populates='staff')
    staff_customers = db.relationship('StaffCustomer', back_populates='staff')

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise AssertionError('Email is not valid')
        return email

    @validates('password')
    def validate_password(self, key, password):
        if len(password) < 5:
            raise AssertionError('Password must be at least 6 characters long')
        if not re.search(r'[A-Z]', password):
            raise AssertionError('Must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password):
            raise AssertionError('Must contain at least one lowercase letter')
        if not re.search(r'[0-9]', password):
            raise AssertionError('Must contain at least one digit')
        if not re.search(r'[@$!%*?&]', password):
            raise AssertionError('Must contain at least one special character')
        if re.search(r'\s', password):
            raise AssertionError('Password must not contain spaces')
        return password


class StaffCustomer(db.Model, SerializerMixin):
    __tablename__ = 'staff_customers'
    serialize_rules = ('-staff.staff_customers', '-customer.staff_customers',)

    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    notes = db.Column(db.String(200))

    staff = db.relationship('Staff', back_populates='staff_customers')
    customer = db.relationship('Customer', back_populates='staff_customers')


class Loan(db.Model, SerializerMixin):
    __tablename__ = 'loans'
    serialize_rules = ('-customer.loans', '-repayments.loan',)

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)
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
    type = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='savings_transactions')


class AuditLog(db.Model, SerializerMixin):
    __tablename__ = 'audit_logs'
    serialize_rules = ('-admin.audit_logs',)

    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    action = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    admin = db.relationship('Admin', back_populates='audit_logs')

# ---------------------------- Models Ends ---------------------------- #



