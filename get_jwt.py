import getpass
import http.client
import json
import logging
import sys

BASE_URL = "https://us-staging-api.hubbub.net/"
BASE_DOMAIN = "us-staging-api.hubbub.net"
TOKEN_URL = "/v1/auth/token"


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    DEFAULT_DOMAIN = "staging-hubbub-mercury.hubbub.net"
    ENTERED_DOMAIN = input(f"Site (default '{DEFAULT_DOMAIN}'): ")
    DOMAIN = ENTERED_DOMAIN if ENTERED_DOMAIN else DEFAULT_DOMAIN
    USERNAME = input("Username: ")
    PASSWORD = getpass.getpass("Password: ")

    if not all([USERNAME, PASSWORD, DOMAIN]):
        sys.exit("Username/password required")

    creds = {"username": USERNAME, "password": PASSWORD, "domain": DOMAIN}
    conn = http.client.HTTPSConnection(BASE_DOMAIN)
    conn.request("POST", TOKEN_URL, json.dumps(creds))
    response = conn.getresponse()
    output = response.read().decode()
    try:
        auth_response = json.loads(output)
    except Exception:
        auth_response = {}

    try:
        jwt = auth_response["token"]
    except Exception:
        print("Bad authentication - no JWT received")
    else:
        print(f"Your JWT (valid for 1 hour)\n\n{jwt}")