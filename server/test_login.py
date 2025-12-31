import requests

url = "http://127.0.0.1:5555/login"
payload = {
    "username": "Bryan Key",   # Replace with actual admin username from DB
    "password": "Password123!", # Replace with actual password used in seeding
    "role": "admin"              # could be "staff" or "customer"
}


response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response Text:", response.text)
