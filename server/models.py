from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt


class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    serialize_rules = ('-staffs','-customers', '-audit_logs.admin','-password_hash',)
   

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(), default="admin") 
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    staffs = db.relationship('Staff', back_populates='admin', cascade="all, delete-orphan")
    customers = db.relationship('Customer', back_populates='admin', cascade="all, delete-orphan")
    audit_logs = db.relationship('AuditLog', back_populates='admin', cascade="all, delete-orphan")

    @validates('email')
    def validates_email(self, key, address):
        if '@' not in address:
            raise ValueError("Invalid email address")
        return address

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Admin {self.username}>"


class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'
    serialize_rules = ('-savings_transactions.customer', '-admin', '-loans.customer', '-repayments.customer', '-staff_customers.customer', '-password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(), default="customer")
    password_hash = db.Column(db.String(50), nullable=False)
    full_name = db.Column(db.String(80), nullable=False)
    national_id = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    savings_balance = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)

    admin = db.relationship('Admin', back_populates='customers')
    loans = db.relationship('Loan', back_populates='customer', cascade="all, delete-orphan")
    repayments = db.relationship('Repayment', back_populates='customer', cascade="all, delete-orphan")
    savings_transactions = db.relationship('SavingsTransaction', back_populates='customer', cascade="all, delete-orphan")
    staff_customers = db.relationship('StaffCustomer', back_populates='customer', cascade="all, delete-orphan")

    @validates('admin_id')
    def validates_admin_id(self, key, val):
        if not Admin.query.get(val):
            raise ValueError("Admin ID does not exist")
        return val

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Customer {self.password_hash}>"


class Staff(db.Model, SerializerMixin):
    __tablename__ = 'staff'
    serialize_rules = ('-staff_customers.staff', '-admin.staffs', '-password_hash',)

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(), default="staff")
    full_name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)

    admin = db.relationship('Admin', back_populates='staffs')
    staff_customers = db.relationship('StaffCustomer', back_populates='staff', cascade="all, delete-orphan")

    @validates('email')
    def validates_email(self, key, address):
        if '@' not in address:
            raise ValueError("Invalid email address")
        return address

    @validates('admin_id')
    def validates_admin_id(self, key, val):
        if not Admin.query.get(val):
            raise ValueError("Admin ID does not exist")
        return val

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<Staff {self.full_name}>"


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

    @validates('staff_id')
    def validates_staff_id(self, key, val):
        if not Staff.query.get(val):
            raise ValueError("Staff ID does not exist")
        return val

    @validates('customer_id')
    def validates_customer_id(self, key, val):
        if not Customer.query.get(val):
            raise ValueError("Customer ID does not exist")
        return val

    def __repr__(self):
        return f"<StaffCustomer staff={self.staff_id}, customer={self.customer_id}>"

class Loan(db.Model, SerializerMixin):
    __tablename__ = 'loans'
    serialize_rules = ('-customer.loans',)

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest_rate = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False)
    issued_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    due_date = db.Column(db.DateTime, nullable=False)

    customer = db.relationship('Customer', back_populates='loans')

    @validates('customer_id')
    def validates_customer_id(self, key, val):
        if not Customer.query.get(val):
            raise ValueError("Customer ID does not exist")
        return val

    @validates('status')
    def validates_status(self, key, val):
        if val not in ["pending", "approved", "rejected"]:
            raise ValueError("Invalid status: must be 'pending', 'approved', or 'rejected'")
        return val

    def __repr__(self):
        return f"<Loan id={self.id}, amount={self.amount}>"


class Repayment(db.Model, SerializerMixin):
    __tablename__ = 'repayments'
    serialize_rules = ('-customer.repayments',)

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_paid = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='repayments')

    @validates('customer_id')
    def validates_customer_id(self, key, val):
        if not Customer.query.get(val):
            raise ValueError("Customer ID does not exist")
        return val

    def __repr__(self):
        return f"<Repayment id={self.id}, amount={self.amount}>"


class SavingsTransaction(db.Model, SerializerMixin):
    __tablename__ = 'savings_transactions'
    serialize_rules = ('-customer.savings_transactions',)

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'deposit' or 'withdrawal'
    amount = db.Column(db.Float, nullable=False)
    transaction_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    customer = db.relationship('Customer', back_populates='savings_transactions')

    @validates('customer_id')
    def validates_customer_id(self, key, val):
        if not Customer.query.get(val):
            raise ValueError("Customer ID does not exist")
        return val

    @validates('type')
    def validates_type(self, key, val):
        if val not in ["deposit", "withdrawal"]:
            raise ValueError("Invalid type: must be 'deposit' or 'withdrawal'")
        return val

    def __repr__(self):
        return f"<SavingsTransaction id={self.id}, amount={self.amount}>"


class AuditLog(db.Model, SerializerMixin):
    __tablename__ = 'audit_logs'
    serialize_rules = ('-admin.audit_logs',)

    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(200), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    admin_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)

    admin = db.relationship('Admin', back_populates='audit_logs')

    @validates('admin_id')
    def validates_admin_id(self, key, val):
        admins = [admin.id for admin in Admin.query.all()]
        if val not in admins:
            raise ValueError("Admin Id does not exist")
        return val

    @validates('admin_id')
    def validates_admin_id(self, key, val):
        if not Admin.query.get(val):
            raise ValueError("Admin ID does not exist")
        return val

    def __repr__(self):
        return f"<AuditLog id={self.id}, action={self.action}>"
