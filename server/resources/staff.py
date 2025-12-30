from flask_restful import Resource
from flask import request, make_response
from datetime import datetime

from models import db, Staff, Admin
from decorators import login_required, role_required


class StaffResource(Resource):

    @login_required
    @role_required("admin")
    def get(self, id=None):
        if id is None:
            staff = Staff.query.all()
            return make_response([s.to_dict() for s in staff], 200)

        staff_member = Staff.query.get(id)
        if not staff_member:
            return make_response({"error": "Staff not found"}, 404)

        return make_response(staff_member.to_dict(), 200)

    @login_required
    @role_required("admin")
    def put(self, id):
        staff = Staff.query.get(id)
        if not staff:
            return make_response({"error": "Staff not found"}, 404)

        data = request.get_json()

        if "admin_id" in data and not Admin.query.get(data["admin_id"]):
            return make_response({"error": "Admin does not exist"}, 404)

        staff.full_name = data.get("full_name", staff.full_name)
        staff.email = data.get("email", staff.email)
        staff.admin_id = data.get("admin_id", staff.admin_id)

        if "password" in data:
            staff.set_password(data["password"])

        if "created_at" in data:
            staff.created_at = datetime.strptime(
                data["created_at"], "%Y-%m-%d %H:%M:%S"
            )

        db.session.commit()
        return make_response(staff.to_dict(), 200)

    @login_required
    @role_required("admin")
    def delete(self, id):
        staff = Staff.query.get(id)
        if not staff:
            return make_response({"error": "Staff not found"}, 404)

        db.session.delete(staff)
        db.session.commit()
        return make_response({"message": "Staff deleted"}, 200)
