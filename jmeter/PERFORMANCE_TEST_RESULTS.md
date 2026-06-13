# JMeter Performance Test Results

## Environment

- Tool: Apache JMeter 5.6.3
- Java: Java 26
- Backend target: `http://localhost:5000/api`
- Test plan: `jmeter/ai-career-launchpad-core-modules.jmx`
- Runner: `jmeter/run-jmeter.ps1`

## Scope

The performance test targets the same core modules selected for automated testing:

- Authentication login
- User profile load
- Dashboard summary
- Resume load/update
- Mock interview start/submit

External provider-heavy modules are not included in this performance test because they can introduce network variability and rate-limit failures that are outside the local application.

## Load Profile

| Setting | Value |
|---|---:|
| Virtual users | 5 |
| Ramp-up | 5 seconds |
| Loops per user | 2 |
| Total transaction samples per module | 10 |

Command used:

```powershell
powershell -ExecutionPolicy Bypass -File .\jmeter\run-jmeter.ps1 -Threads 5 -RampUp 5 -Loops 2
```

## Results

Latest raw results:

`jmeter/results/jmeter-results-20260522-100913.jtl`

HTML dashboard:

`jmeter/reports/html-report/index.html`

| Transaction | Samples | Avg (ms) | Min (ms) | Max (ms) | Error % |
|---|---:|---:|---:|---:|---:|
| 01_Auth_Login | 10 | 51.1 | 7 | 206 | 0 |
| 02_Profile_Get | 10 | 17.4 | 4 | 63 | 0 |
| 03_Dashboard_Summary | 10 | 45.9 | 9 | 85 | 0 |
| 04_Resume_Module | 10 | 90.3 | 19 | 170 | 0 |
| 05_Mock_Interview | 10 | 58.2 | 14 | 226 | 0 |

## Interpretation

All tested core modules completed with **0% errors** under the selected local load profile. Average response times stayed below 100 ms for every module. The resume transaction was the slowest average module because it includes both loading and updating resume data. The highest observed response time was 226 ms during the mock interview transaction, which is still acceptable for this local academic performance test.

## Notes

- `RATE_LIMIT_MAX_REQUESTS` was configured high enough for local testing.
- The JMeter console summary may show `0` because the useful data is written to the `.jtl` file and HTML dashboard. The `.jtl` file contains the actual transaction samples.
- Heavier tests can be run by increasing `-Threads` and `-Loops`, but database and machine limits should be monitored.
