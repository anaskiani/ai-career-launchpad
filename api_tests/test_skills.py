"""
test_skills.py — API tests for /api/skills/* endpoints (Skill Gap Analyzer).

Covers:
  - GET  /api/skills/roles        (functional, auth)
  - POST /api/skills/analyze      (functional, negative, invariant)
  - GET  /api/skills/history      (functional, state-based)

Oracle: Status codes, JSON schema, and invariant match_percentage in [0, 100]
"""

import pytest
import requests


# ─── GET /api/skills/roles ───────────────────────────────────────────────────

def test_get_roles_requires_auth(base_url):
    """
    WHAT: GET /api/skills/roles without token → 401.
    WHY CORRECT: protect middleware verifies JWT; missing token = unauthorized.
    """
    response = requests.get(f"{base_url}/api/skills/roles", timeout=10)
    assert response.status_code == 401


def test_get_roles_returns_list_with_valid_token(base_url, auth_headers):
    """
    WHAT: GET /api/skills/roles with valid token → 200 + array of role names.
    WHY CORRECT: skillRolesData.js defines 18+ roles; controller returns all.
    """
    response = requests.get(f"{base_url}/api/skills/roles", headers=auth_headers, timeout=10)
    assert response.status_code == 200
    data = response.json()
    roles = data.get("roles") or data
    assert isinstance(roles, list), "Response must be an array of roles"
    assert len(roles) > 0, "At least one role must exist"


def test_get_roles_includes_known_roles(base_url, auth_headers):
    """
    WHAT: Role list contains expected roles from skillRolesData.js.
    WHY CORRECT: These are hardcoded in data/skillRolesData.js; must always exist.
    """
    response = requests.get(f"{base_url}/api/skills/roles", headers=auth_headers, timeout=10)
    assert response.status_code == 200
    data = response.json()
    roles_raw = data.get("roles") or data
    roles = [r if isinstance(r, str) else r.get("name", "") for r in roles_raw]
    assert any("Frontend" in r or "frontend" in r for r in roles), \
        "Expected 'Frontend Developer' role in list"


# ─── POST /api/skills/analyze ───────────────────────────────────────────────

def test_analyze_valid_role_returns_200(base_url, auth_headers):
    """
    WHAT: POST /api/skills/analyze with a valid role → 200 + analysis result.
    WHY CORRECT: Controller looks up role in skillRolesData, computes match.
    """
    payload = {"targetRole": "Frontend Developer"}
    response = requests.post(
        f"{base_url}/api/skills/analyze",
        json=payload,
        headers=auth_headers,
        timeout=15,
    )
    assert response.status_code == 200, f"Expected 200: {response.text[:300]}"
    data = response.json()
    analysis = data.get("analysis") or data
    assert "matchPercentage" in analysis or "match_percentage" in analysis


def test_analyze_match_percentage_invariant(base_url, auth_headers):
    """
    WHAT: matchPercentage for any valid role is always between 0 and 100.
    WHY CORRECT: Percentage = (matching / required) * 100, bounded by math.
    ORACLE TYPE: Invariant
    """
    payload = {"targetRole": "Frontend Developer"}
    response = requests.post(
        f"{base_url}/api/skills/analyze",
        json=payload,
        headers=auth_headers,
        timeout=15,
    )
    assert response.status_code == 200
    data = response.json()
    analysis = data.get("analysis") or data
    pct = analysis.get("matchPercentage") or analysis.get("match_percentage", -1)
    pct = float(pct)
    assert 0 <= pct <= 100, f"matchPercentage {pct} is out of [0, 100] range — INVARIANT VIOLATED"


def test_analyze_without_auth_returns_401(base_url):
    """
    WHAT: POST /api/skills/analyze without token → 401.
    WHY CORRECT: protect middleware guards this route.
    """
    payload = {"targetRole": "Frontend Developer"}
    response = requests.post(f"{base_url}/api/skills/analyze", json=payload, timeout=10)
    assert response.status_code == 401


def test_analyze_invalid_role_returns_error(base_url, auth_headers):
    """
    WHAT: POST /api/skills/analyze with a non-existent role → 400 or empty.
    WHY CORRECT: No matching role in skillRolesData → controller must reject or return empty.
    """
    payload = {"targetRole": "NonExistentRoleXYZ99"}
    response = requests.post(
        f"{base_url}/api/skills/analyze",
        json=payload,
        headers=auth_headers,
        timeout=10,
    )
    # Either 400 Bad Request or 200 with empty/zero result is acceptable
    assert response.status_code in (400, 404, 200)
    if response.status_code == 200:
        data = response.json()
        analysis = data.get("analysis") or data
        pct = float(analysis.get("matchPercentage") or analysis.get("match_percentage", 0))
        assert pct == 0, "Unknown role should produce 0% match"


def test_analyze_missing_role_field_returns_400(base_url, auth_headers):
    """
    WHAT: POST /api/skills/analyze with no targetRole field → 400 (boundary/negative).
    WHY CORRECT: express-validator requires targetRole; missing = validation error.
    """
    response = requests.post(
        f"{base_url}/api/skills/analyze",
        json={},
        headers=auth_headers,
        timeout=10,
    )
    assert response.status_code == 400


# ─── GET /api/skills/history ────────────────────────────────────────────────

def test_get_history_requires_auth(base_url):
    """
    WHAT: GET /api/skills/history without token → 401.
    WHY CORRECT: protect middleware required.
    """
    response = requests.get(f"{base_url}/api/skills/history", timeout=10)
    assert response.status_code == 401


def test_get_history_returns_array(base_url, auth_headers):
    """
    WHAT: GET /api/skills/history with valid token → 200 + array.
    WHY CORRECT: History is always a list (may be empty for fresh user).
    ORACLE TYPE: State validation
    """
    response = requests.get(f"{base_url}/api/skills/history", headers=auth_headers, timeout=10)
    assert response.status_code == 200
    data = response.json()
    history = data.get("history") or data
    assert isinstance(history, list), "History must be an array"
