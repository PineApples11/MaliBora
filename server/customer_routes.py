# from flask import request, make_response
# from datetime import datetime
# from models import Admin, Customer, db

# def init_customer_routes(app):
#     @app.route('/customer', methods=['POST'])
#     def handle_customer_post():
#         data = request.get_json()
#         admin_id = data['admin_id']
#         exists = Admin.query.filter_by(id=admin_id).first()
#         if not exists:
#             return make_response({"error": "Admin id does not exist"}, 404)
        
#         try:
#             created_at = datetime.strptime(data['created_at'], "%Y-%m-%d %H:%M:%S")
#         except:
#             raise ValueError("wrong dates")

#         try:
#             new_customer = Customer(
#                admin_id = admin_id,
#                full_name = data['full_name'],
#                national_id = data['national_id'],
#                phone = data['phone'],
#                savings_balance = data['savings_balance'],
#                created_at = created_at
#             )
#             password = data["password_hash"]
#             new_customer.set_password(password)

#             db.session.add(new_customer)
#             db.session.commit()

#             return make_response(new_customer.to_dict(), 201)
        
#         except Exception as e:
#             return make_response({"error": "Bad Request", "message": str(e)}, 400)

