<p align="center">
  <h1 align="center">🚀 AI Career Launchpad</h1>
  <p align="center">
    <strong>AI-powered career development platform for university students</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-v16+-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
  </p>
</p>

> Full-stack web application with 8 modules, 35 API endpoints, and 100+ test cases. Built with MySQL + Express.js + React + Node.js (MERN-style).

> 📖 **For the full detailed documentation** (all endpoints, database schema, component list, file tree, etc.), see [README_DETAILED.md](README_DETAILED.md).

---

## ✨ Key Features

| Module | Description |
|--------|-------------|
| **Authentication** | Email/password signup with OTP verification, Google OAuth 2.0, JWT tokens, password reset |
| **User Profile** | Full profile management with avatar upload, education, work experience, skills |
| **Resume Builder** | Multi-section resume editor with live preview & PDF export (jsPDF) |
| **Skill Gap Analyzer** | Compare skills against target roles, get match % and learning roadmap |
| **Job Finder** | Search real remote jobs via Remotive API, save/bookmark, fallback to mock data |
| **Mock Interview Quiz** | Role-based MCQ quizzes with scoring and history tracking |
| **AI Career Chatbot** | Groq Cloud (Llama 3.3-70B) powered career coach with offline fallback |
| **Dashboard** | Aggregated stats, charts (Recharts), recent activity feed |

---

## 🛠️ Tech Stack

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express.js | REST API server |
| MySQL 8+ / TiDB Cloud | Relational database (mysql2 driver) |
| JWT + bcryptjs | Authentication & password hashing |
| Nodemailer | OTP email via Gmail SMTP |
| Groq SDK | AI chatbot (Llama 3.3-70B) |
| google-auth-library | Google OAuth verification |
| Helmet + CORS + express-rate-limit | Security middleware |
| express-validator | Input validation |
| Multer | Avatar file upload |
| compression | Gzip response compression |

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI library + build tool |
| React Router v6 | Client-side routing (lazy-loaded) |
| Zustand | State management (5 stores) |
| Axios | HTTP client with JWT interceptors |
| TailwindCSS | Utility-first styling |
| Recharts | Dashboard charts |
| Zod | Frontend form validation |
| jsPDF | Resume PDF generation |
| Lucide React | Icon library |
| @react-oauth/google | Google sign-in button |

---

## 🏗️ Architecture

```
Frontend (React + Vite, port 5173)
  Pages → Components → Services → Axios
  State: Zustand Stores | Routing: React Router v6
          │ REST API (HTTP)
          ▼
Backend (Express.js, port 5000)
  Routes → Controllers → MySQL Pool (mysql2)
  Middleware: JWT Auth, Rate Limiter, Helmet, CORS
  External: Groq AI, Remotive Jobs API, Gmail SMTP
          │ SQL
          ▼
Database (MySQL 8+ / TiDB Cloud)
  7 tables: users, resumes, skill_gaps, jobs,
            saved_jobs, interviews, chat_messages
```

---

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt (salt rounds = 10) |
| JWT Auth | Access token (7d) + Refresh token (30d) |
| Email OTP | 6-digit code, 10-minute expiry |
| HTTP Headers | Helmet.js (CSP, HSTS, etc.) |
| Rate Limiting | Configurable window + max requests |
| CORS | Origin whitelist |
| Input Validation | express-validator (backend) + Zod (frontend) |
| Error Handling | Centralized middleware, no stack traces in production |
| File Uploads | Multer with 5MB limit + MIME type filtering |
| Dev Bypass | Auto-disabled in production |

---

## 🧪 Testing (100+ test cases, 20+ files)

### Backend Unit Tests — `node --test`
| File | Coverage |
|------|----------|
| `unit.test.mjs` | Email/password validators, interview scoring |
| `dbHelpers.test.mjs` | UUID generation, JSON helpers, profile completion |
| `chatPrompts.test.mjs` | Topic detection, fallback replies |
| `simpleCache.test.mjs` | Cache set/get, TTL expiry, deletion |
| `smoke.mjs` | API endpoint smoke tests |

### Frontend Component Tests — `Vitest + Testing Library`
| Component | Tests |
|-----------|-------|
| Login, Register, ForgotPassword | Auth flows, OTP, error handling |
| Dashboard | Summary cards, charts, activity feed |
| ResumeBuilder | CRUD, preview, save states |
| SkillGapAnalyzer | Role selection, analysis, history |
| JobFinder | Search, save, pagination, fallback |
| MockInterview | Quiz sessions, MCQ selection, scoring |
| AIChatbot | Messages, history, topics, fallback |
| SkillsInput, PersonalInfo, Validators | Unit tests |

### Additional Testing
- **API Integration Tests** — `api_tests/` (auth, skills, profile)
- **E2E / GUI Tests** — `e2e/` (Selenium WebDriver, 18 test cases)
- **Load / Stress Tests** — Artillery + Autocannon (`load_tests/`)
- **Performance Tests** — JMeter test plans (`jmeter/`)

```bash
# Run tests
npm run test:unit          # Backend unit tests
npm run test:frontend      # Frontend component tests
npm run test:api           # API integration tests
npm run test:all           # All tests
npm run load:quick         # Quick load test
```

---

## 🔌 API Endpoints (35 total)

| Group | Routes | Auth | Endpoints |
|-------|--------|------|-----------|
| Auth | `/api/auth/*` | ❌ | `register`, `verify-email`, `login`, `google`, `forgot-password`, `reset-password`, `logout` |
| Users | `/api/users/*` | ✅ | `GET/PUT profile`, `POST/DELETE avatar`, `DELETE account` |
| Resume | `/api/resume/*` | ✅ | `GET`, `POST`, `PUT /:id`, `DELETE /:id` |
| Skills | `/api/skills/*` | ✅ | `roles`, `roles/:role`, `analyze`, `history`, `analysis/:id`, `DELETE analysis/:id` |
| Jobs | `/api/jobs/*` | ✅ | `search`, `saved`, `/:jobId`, `save/:jobId`, `DELETE save/:jobId` |
| Interviews | `/api/interviews/*` | ✅ | `roles`, `questions`, `history`, `/:id`, `start`, `PUT /:id/answers`, `POST /:id/submit` |
| AI Chat | `/api/ai/*` | ✅ | `history`, `chat` |
| Dashboard | `/api/dashboard/*` | ✅ | `summary` |
| System | `/api/health` | ❌ | Health check |

---

## ⚙️ Setup

### Prerequisites
- Node.js v16+, npm, MySQL 8+ (or TiDB Cloud)

### Quick Start
```bash
# Clone & install
git clone <repo-url> && cd ai-career-launchpad

# Backend
cd backend && npm install
cp .env.example .env        # Configure DB credentials & API keys
node init-tidb.mjs          # Initialize database tables
npm run dev                 # http://localhost:5000

# Frontend (new terminal)
cd frontend && npm install
npm run dev                 # http://localhost:5173
```

### Environment Variables

**Backend** (`backend/.env`):
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` or `DB_HOST/PORT/USER/PASSWORD/NAME` | Yes | MySQL connection |
| `JWT_SECRET` | Yes | JWT signing key |
| `GROQ_API_KEY` | No | AI chatbot (falls back to offline) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth |
| `EMAIL_USER` / `EMAIL_PASSWORD` / `EMAIL_FROM` | No | Gmail SMTP for OTP |
| `RATE_LIMIT_WINDOW` / `RATE_LIMIT_MAX_REQUESTS` | No | Rate limiting config |

**Frontend** (`frontend/.env`):
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API URL (e.g., `http://localhost:5000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |

---

## 🚀 Deployment

Deployed on **Vercel** (frontend + backend) with **TiDB Cloud** (database).

```bash
cd backend  && vercel --prod    # Deploy backend
cd frontend && vercel --prod    # Deploy frontend
```

Both directories include `vercel.json` pre-configured for routing and CORS.

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| Modules | 8 |
| API Endpoints | 35 |
| Database Tables | 7 |
| React Components | 42 |
| Zustand Stores | 5 + Auth Context |
| Frontend Services | 9 |
| Test Files | 20+ (100+ cases) |
| External APIs | 4 (Groq, Remotive, Gmail SMTP, Google OAuth) |

---

## 📄 License

MIT — Free to use for university projects.
