# Production authentication checklist

Before deploying publicly, complete these steps.

## 1. Disable dev login bypass

In `backend/.env`:

```env
NODE_ENV=production
DEV_BYPASS_AUTH=false
```

Remove or do not set `DEV_LOGIN_*` in production.

## 2. Rotate secrets

Generate new values (32+ characters):

- `JWT_SECRET`
- `REFRESH_TOKEN_SECRET`

Never commit real secrets to git.

## 3. Use real 3-factor login

Users must complete:

1. Email + password
2. Email OTP (configure Gmail app password)
3. Security question + PIN

Test registration and login without dev credentials.

## 4. CORS and frontend URL

```env
FRONTEND_URLS=https://your-app.vercel.app
```

## 5. HTTPS only

Deploy backend and frontend behind HTTPS. Cookies/tokens must not be sent over plain HTTP in production.

## 6. Rate limiting

Defaults in `.env`:

```env
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

Tune for your expected traffic.

## 7. Forgot password

Requires working `EMAIL_USER` / `EMAIL_PASSWORD`. Test `/forgot-password` on the live site.
