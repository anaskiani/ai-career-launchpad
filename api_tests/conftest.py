"""
conftest.py — shared pytest fixtures for AI Career Launchpad API tests.

Usage:
    pytest -v                          # run all API tests
    pytest test_auth.py -v             # run auth tests only
    pytest -v --html=report.html       # with HTML report (pip install pytest-html)
"""

import pytest
import requests
import os

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:5000")

# Dev credentials (matches devAuth.js bypass user)
DEV_EMAIL    = os.getenv("DEV_LOGIN_EMAIL",    "dev@localhost.com")
DEV_PASSWORD = os.getenv("DEV_LOGIN_PASSWORD", "devpassword")


@pytest.fixture(scope="session")
def base_url():
    """Base URL for the backend API server."""
    return BASE_URL


@pytest.fixture(scope="session")
def auth_token(base_url):
    """
    Obtain a valid JWT by logging in with dev credentials.
    Skips entire session if backend is unreachable.
    """
    try:
        response = requests.post(
            f"{base_url}/api/auth/login",
            json={"email": DEV_EMAIL, "password": DEV_PASSWORD},
            timeout=10,
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("token") or data.get("accessToken") or data.get("access_token")
            if token:
                return token
        # If dev bypass is on, token might be returned differently
        pytest.skip(f"Could not obtain auth token. Response: {response.status_code} — {response.text[:200]}")
    except requests.exceptions.ConnectionError:
        pytest.skip(f"Backend server not reachable at {base_url}. Start server first.")


@pytest.fixture
def auth_headers(auth_token):
    """Authorization header dict ready for use in requests."""
    return {"Authorization": f"Bearer {auth_token}"}
