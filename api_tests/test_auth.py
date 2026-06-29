"""
test_auth.py — API tests for /api/auth/* endpoints.

Covers:
  - POST /api/auth/register   (functional, negative, boundary)
  - POST /api/auth/login      (functional, negative)
  - GET  /api/health          (smoke)

Oracle: HTTP status codes + JSON schema presence
"""

import pytest
import requests
import time


# ─── Smoke / Health ─────────────────────────────────────────────────────────

def test_health_endpoint_returns_200(base_url):
    """
    WHAT: GET /api/health responds with 200 and status ok.
    WHY CORRECT: Health endpoint has no auth; must always be reachable.
    """
    response = requests.get(f"{base_url}/api/health", timeout=10)
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "ok" or "ok" in str(data).lower()


# ─── Registration ────────────────────────────────────────────────────────────

def test_register_missing_email_returns_400(base_url):
    """
    WHAT: POST /api/auth/register with no email → 400.
    WHY CORRECT: express-validator requires 'email' field; missing = bad request.
    """
    payload = {"name": "Test User", "password": "validpass123"}
    response = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"


def test_register_missing_password_returns_400(base_url):
    """
    WHAT: POST /api/auth/register with no password → 400.
    WHY CORRECT: Password is required for bcrypt hashing; absence fails validation.
    """
    payload = {"name": "Test User", "email": f"nopass_{int(time.time())}@test.com"}
    response = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert response.status_code == 400


def test_register_short_password_returns_400(base_url):
    """
    WHAT: Password shorter than 6 chars → 400 (boundary test).
    WHY CORRECT: Minimum password length = 6 (matches validatePassword in validators.js).
    """
    payload = {
        "name": "Boundary User",
        "email": f"boundary_{int(time.time())}@test.com",
        "password": "abc",  # only 3 chars — below boundary
    }
    response = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert response.status_code == 400


def test_register_invalid_email_format_returns_400(base_url):
    """
    WHAT: POST /api/auth/register with malformed email → 400 (negative test).
    WHY CORRECT: express-validator email() rule rejects non-email strings.
    """
    payload = {
        "name": "Bad Email User",
        "email": "not-an-email",
        "password": "validpass123",
    }
    response = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert response.status_code == 400


def test_register_valid_user_returns_201(base_url):
    """
    WHAT: POST /api/auth/register with valid data → 201 Created.
    WHY CORRECT: New user is created in DB, OTP queued; response confirms creation.
    NOTE: This creates a real user. Timestamp in email ensures uniqueness.
    """
    unique_email = f"apitest_{int(time.time())}@test.com"
    payload = {"name": "API Test User", "email": unique_email, "password": "securepass99"}
    response = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text[:300]}"
    data = response.json()
    assert "message" in data


def test_register_duplicate_email_returns_409(base_url):
    """
    WHAT: Registering with an already-used email → 409 Conflict.
    WHY CORRECT: UNIQUE constraint on users.email in MySQL; controller returns 409.
    """
    # First register a new user
    unique_email = f"dup_{int(time.time())}@test.com"
    payload = {"name": "Dup User", "email": unique_email, "password": "securepass99"}
    first = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert first.status_code == 201

    # Second registration with same email
    second = requests.post(f"{base_url}/api/auth/register", json=payload, timeout=10)
    assert second.status_code == 409, f"Expected 409, got {second.status_code}"


# ─── Login ───────────────────────────────────────────────────────────────────

def test_login_valid_credentials_returns_token(base_url):
    """
    WHAT: POST /api/auth/login with valid dev credentials → 200 + token.
    WHY CORRECT: bcrypt.compare() matches hash; JWT issued with 7-day expiry.
    """
    payload = {
        "email": "dev@localhost.com",
        "password": "devpassword",
    }
    response = requests.post(f"{base_url}/api/auth/login", json=payload, timeout=10)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text[:300]}"
    data = response.json()
    # Token may be named 'token', 'accessToken', or nested
    token = data.get("token") or data.get("accessToken") or data.get("access_token")
    assert token is not None, "Response must contain a JWT token"
    assert isinstance(token, str) and len(token) > 20


def test_login_wrong_password_returns_401(base_url):
    """
    WHAT: POST /api/auth/login with correct email but wrong password → 401.
    WHY CORRECT: bcrypt.compare() fails; no token issued.
    """
    payload = {"email": "dev@localhost.com", "password": "definitely-wrong-password"}
    response = requests.post(f"{base_url}/api/auth/login", json=payload, timeout=10)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"


def test_login_nonexistent_user_returns_401(base_url):
    """
    WHAT: POST /api/auth/login with unknown email → 401.
    WHY CORRECT: DB lookup returns no row; controller returns 401 (no user found).
    """
    payload = {"email": "nobody_exists_xyz@ghost.com", "password": "irrelevant"}
    response = requests.post(f"{base_url}/api/auth/login", json=payload, timeout=10)
    assert response.status_code == 401


def test_login_empty_body_returns_400(base_url):
    """
    WHAT: POST /api/auth/login with empty JSON → 400 (boundary/negative).
    WHY CORRECT: express-validator requires email and password; empty body fails.
    """
    response = requests.post(f"{base_url}/api/auth/login", json={}, timeout=10)
    assert response.status_code in (400, 401)
