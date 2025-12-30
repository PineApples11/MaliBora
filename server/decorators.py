from functools import wraps
from flask import make_response, session


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if session.get("user_id"):
            return make_response({"error": "Unauthorized. Please Log in!"}, 401)

        return fn(*args, **kwargs)
    
    return wrapper

def role_required(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            role = session.get("role")
            if role not in allowed_roles:
                return make_response({"error": "Forbidden"}, 401)
            
           
          
            
            return fn(*args, **kwargs)
        
        return wrapper
    
    return decorator