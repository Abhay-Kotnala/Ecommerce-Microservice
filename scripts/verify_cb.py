import urllib.request
import json
import time

url = "http://localhost:8081/api/orders"
headers = {"Content-Type": "application/json"}
fail_payload = json.dumps({"userId": "test", "productId": 1, "quantity": 101}).encode('utf-8')
success_payload = json.dumps({"userId": "test", "productId": 1, "quantity": 1}).encode('utf-8')

def send_request(payload):
    req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as f:
            print(f"Code={f.status}, Body={f.read().decode('utf-8')}")
    except urllib.error.HTTPError as e:
        print(f"Code={e.code}, Reason={e.reason}, Body={e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Failed: {e}")

print("--- Sending 10 Failing Requests ---")
for i in range(10):
    print(f"Request {i+1}: ", end="")
    send_request(fail_payload)

print("\n--- Sending 1 Valid Request (Expect Circuit Open/Fallback) ---")
send_request(success_payload)

print("\n--- Waiting 6s ---")
time.sleep(6)

print("\n--- Sending 1 Valid Request (Expect Success) ---")
send_request(success_payload)
