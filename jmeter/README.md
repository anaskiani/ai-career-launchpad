# JMeter performance tests — core modules

Load tests for the **same modules** covered by unit tests, GUI (Selenium), and API smoke tests:

| Module | JMeter transaction | API endpoints |
|--------|-------------------|---------------|
| Authentication | `01_Auth_Login` | `POST /api/auth/login` |
| Profile (login flow) | `02_Profile_Get` | `GET /api/users/profile` |
| Dashboard (post-login) | `03_Dashboard_Summary` | `GET /api/dashboard/summary` |
| Resume | `04_Resume_Module` | `GET /api/resume`, optional `POST` create, `PUT /api/resume/{id}` |
| Mock interview | `05_Mock_Interview` | `POST /api/interviews/start`, `POST .../submit` |

## Prerequisites

1. **Apache JMeter 5.6+** installed — https://jmeter.apache.org/download_jmeter.cgi  
2. **Backend running:** `cd backend && npm run dev` (port 5000)  
3. **MySQL** running (XAMPP)  
4. **Dev login** in `backend/.env`:
   ```env
   DEV_BYPASS_AUTH=true
   DEV_LOGIN_EMAIL=dev@localhost.com
   DEV_LOGIN_PASSWORD=devpassword
   ```
5. **Raise rate limit** for load testing (add to `backend/.env`):
   ```env
   RATE_LIMIT_MAX_REQUESTS=10000
   RATE_LIMIT_WINDOW=15
   ```
   Restart backend after changing `.env`.

## Quick run (GUI)

1. Open **Apache JMeter**
2. **File → Open** → `jmeter/ai-career-launchpad-core-modules.jmx`
3. Review **User Defined Variables** (host, port, credentials)
4. Click **Start** (green play)
5. Open **View Results Tree** only for debugging (disable for real runs — slow)
6. Check **Summary Report** and **Aggregate Report**
7. **File → Save As** HTML report: `jmeter/reports/html-report`

## Command line (recommended for report)

```powershell
cd jmeter

# Run test (adjust -JTHREADS=20 -JRAMPUP=30 -JLOOPS=5 on command line)
jmeter -n -t ai-career-launchpad-core-modules.jmx -l results/jmeter-results.jtl -e -o reports/html-report
```

Open `jmeter/reports/html-report/index.html` in a browser for charts (throughput, response times, errors).

## Suggested load profile (academic project)

| Property | Default | Meaning |
|----------|---------|---------|
| `THREADS` | 10 | Concurrent virtual users |
| `RAMPUP` | 20 | Seconds to start all threads |
| `LOOPS` | 5 | Full module flow repeats per user |

Light test: `-JTHREADS=5 -JLOOPS=2`  
Medium: defaults  
Stress (careful): `-JTHREADS=50 -JLOOPS=10` — watch MySQL and CPU

## Screenshots for Word

Capture from JMeter GUI or HTML report:

1. Test Plan tree showing module transactions  
2. Summary Report table  
3. Aggregate Report / Response Times graph  
4. Dashboard graph from HTML report  

## Files

| File | Purpose |
|------|---------|
| `ai-career-launchpad-core-modules.jmx` | Main test plan |
| `run-jmeter.ps1` | Windows CLI runner |
| `results/` | `.jtl` raw results (gitignored) |
| `reports/` | HTML dashboard output |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 429 Too Many Requests | Increase `RATE_LIMIT_MAX_REQUESTS` in backend `.env` |
| 401 on protected APIs | Check dev credentials; login sampler must run first |
| Resume PUT 404 | Test plan auto-creates resume if missing; or open `/resume` once in the app |
| Connection refused | Start backend on port 5000 |
