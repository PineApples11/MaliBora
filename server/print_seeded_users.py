from app import app, db
from models import Admin, Staff, Customer

if __name__ == "__main__":
    with app.app_context():
        print("=== Admins ===")
        for admin in Admin.query.all():
            print(f"ID: {admin.id}, Username: {admin.username}, Email: {admin.email}")

        print("\n=== Staff ===")
        for staff in Staff.query.all():
            print(f"ID: {staff.id}, Name: {staff.full_name}, Email: {staff.email}")

        print("\n=== Customers ===")
        for customer in Customer.query.all():
            print(f"ID: {customer.id}, Name: {customer.full_name}, Email: {getattr(customer, 'email', 'N/A')}")
