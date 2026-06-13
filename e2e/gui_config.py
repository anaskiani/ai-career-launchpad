import os

BASE_URL = os.getenv("GUI_BASE_URL", "http://localhost:5173").rstrip("/")
DEV_EMAIL = os.getenv("DEV_LOGIN_EMAIL", "dev@localhost.com")
DEV_PASSWORD = os.getenv("DEV_LOGIN_PASSWORD", "devpassword")
HEADLESS = os.getenv("GUI_HEADLESS", "0") == "1"
IMPLICIT_WAIT = int(os.getenv("GUI_IMPLICIT_WAIT", "5"))
EXPLICIT_WAIT = int(os.getenv("GUI_EXPLICIT_WAIT", "20"))
