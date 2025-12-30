from flask_restful import Resource
from flask import request, make_response
from datetime import datetime

from models import db, Admin
from decorators import login_required, role_required


class AdminResource(Resource):

    @login_required
    @role_required("admin")
    def get(self, id=None):
        if id is None:
            admins = Admin.query.all()
            return make_response([a.to_dict() for a in admins], 200)

        admin = Admin.query.get(id)
        if not admin:
            return make_response({"error": "Admin not found"}, 404)

        return make_response(admin.to_dict(), 200)

    @login_required
    @role_required("admin")
    def put(self, id):
        admin = Admin.query.get(id)
        if not admin:
            return make_response({"error": "Admin not found"}, 404)

        data = request.get_json()

        admin.username = data.get("username", admin.username)
        admin.email = data.get("email", admin.email)

        if "password" in data:
            admin.set_password(data["password"])

        if "created_at" in data:
            admin.created_at = datetime.strptime(
                data["created_at"], "%Y-%m-%d %H:%M:%S"
            )

        db.session.commit()
        return make_response(admin.to_dict(), 200)
