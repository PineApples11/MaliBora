from flask_restful import Resource
from flask import make_response
from models import AuditLog
from decorators import login_required, role_required


class AuditLogResource(Resource):

    @login_required
    @role_required("admin")
    def get(self, id=None):
        if id is None:
            logs = AuditLog.query.all()
            return make_response([log.to_dict() for log in logs], 200)

        log = AuditLog.query.get(id)
        if not log:
            return make_response({"error": "Audit log not found"}, 404)

        return make_response(log.to_dict(), 200)
