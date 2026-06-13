# JMeter report captions (paste into Word)

## Test description (paragraph)

Performance testing was conducted on AI Career Launchpad using Apache JMeter. The test plan targets the same core modules validated by unit tests, API smoke tests, and Selenium GUI tests: Authentication (login), User Profile, Dashboard summary, Resume update, and Mock Interview (start and submit). Concurrent virtual users executed the full API flow with configurable load (default: 10 users, 20 s ramp-up, 5 loops).

## Figures to capture

| Figure | Source in JMeter |
|--------|-------------------|
| Figure X: JMeter test plan structure | Test Plan tree showing transactions 01–05 |
| Figure X: Summary Report | Listener → Summary Report after test run |
| Figure X: Aggregate Report | Listener → Aggregate Report (avg response time per module) |
| Figure X: HTML dashboard | `jmeter/reports/html-report/index.html` → Statistics / Response Times Over Time |

## Sample results table (fill after run)

| Transaction | Samples | Avg (ms) | Error % |
|-------------|---------|----------|---------|
| 01_Auth_Login | | | |
| 02_Profile_Get | | | |
| 03_Dashboard_Summary | | | |
| 04_Resume_Module | | | |
| 05_Mock_Interview | | | |

## Interpretation template

- **Throughput:** Higher requests/sec indicates better capacity under load.
- **Response time:** Average &lt; 500 ms is good for local testing; investigate spikes &gt; 2 s.
- **Error rate:** Should be 0% for a passing run; 401 errors → login/token issue; 429 → rate limit; 404 on resume → create resume once in app.
