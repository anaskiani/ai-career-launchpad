# End-to-end demo path (no paid APIs)

Use this script for a university demo or viva. Total time: ~10 minutes.

## Prerequisites

1. MySQL running (XAMPP → Start MySQL)
2. Backend: `cd backend && npm run dev`
3. Frontend: `cd frontend && npm run dev`
4. Login: `dev@localhost.com` / `devpassword`

## Demo script

| Step | Page | What to show |
|------|------|----------------|
| 1 | `/login` | Dev login (one step, no OTP) |
| 2 | `/profile` | Fill name, target role, add 3+ skills, save |
| 3 | `/skills` | Run analysis for your target role → match %, roadmap |
| 4 | `/resume` | Add summary + experience → export PDF |
| 5 | `/jobs` | Search "developer" → save a job (demo listings) |
| 6 | `/interview` | Start Frontend Developer → answer 1–2 questions → Submit → show scores |
| 7 | `/chatbot` | Ask "How should I prepare for interviews?" (offline coach) |
| 8 | `/dashboard` | Show aggregated stats from steps above |

## Talking points

- **Skill analyzer** uses curated role data (no external API).
- **Jobs** use built-in demo listings when RapidAPI is not configured.
- **Chatbot** uses offline career coach templates (OpenRouter optional later).
- **Interviews** use local scoring (keyword + structure heuristics).

## Optional

Run backend smoke tests: `cd backend && npm run test`
