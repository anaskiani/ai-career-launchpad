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

> A comprehensive full-stack web application designed for university students to accelerate their career growth using AI-powered tools. Built with the MERN-style architecture (MySQL + Express.js + React + Node.js).

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture](#-project-architecture)
5. [Modules Breakdown (Total: 8)](#-modules-breakdown-total-8)
6. [API Endpoints (Total: 34)](#-api-endpoints-total-34)
7. [Database Schema (7 Tables)](#-database-schema-7-tables)
8. [External APIs & Services Used (4)](#-external-apis--services-used-4)
9. [Frontend Pages & Routing (12 Routes)](#-frontend-pages--routing-12-routes)
10. [State Management (6 Stores)](#-state-management-6-stores)
11. [Frontend Services (9 Services)](#-frontend-services-9-services)
12. [Frontend Components (42 Components)](#-frontend-components-42-components)
13. [Middleware (3 Middleware)](#-middleware-3-middleware)
14. [Utility Modules (13 Utilities)](#-utility-modules-13-utilities)
15. [Authentication Flow](#-authentication-flow)
16. [Security Features](#-security-features)
17. [Testing](#-testing)
18. [Installation & Setup](#-installation--setup)
19. [Environment Variables](#-environment-variables)
20. [Deployment](#-deployment)
21. [Project File Structure](#-project-file-structure)
22. [NPM Scripts](#-npm-scripts)
23. [Troubleshooting](#-troubleshooting)
24. [Future Enhancements](#-future-enhancements)
25. [Project Summary Statistics](#-project-summary-statistics)
26. [License](#-license)

---

## 📋 Project Overview

**AI Career Launchpad** is a career development platform that provides students with tools for resume building, skill gap analysis, job searching, mock interviews, and AI-powered career guidance — all in one place.

| Attribute             | Details                                     |
| --------------------- | ------------------------------------------- |
| **Project Type**      | Full-Stack Web Application                  |
| **Architecture**      | Client-Server (REST API)                    |
| **Frontend**          | React 18 SPA with Vite                      |
| **Backend**           | Express.js REST API (Node.js, ESM)          |
| **Database**          | MySQL 8+ (via mysql2 connection pool)       |
| **Authentication**    | JWT + Email OTP + Google OAuth 2.0          |
| **AI Integration**    | Groq Cloud (Llama 3.3-70B) for AI chatbot  |
| **Job Data Source**   | Remotive API (remote jobs) + Fallback Data  |
| **Deployment Target** | Vercel (both frontend & backend)            |
| **License**           | MIT                                         |

---

## ✨ Key Features

| # | Feature                   | Description                                                              |
|---|---------------------------|--------------------------------------------------------------------------|
| 1 | **User Registration**     | Email + password signup with OTP email verification                      |
| 2 | **User Login**            | Email/password login with JWT tokens; Google OAuth sign-in               |
| 3 | **Forgot Password**       | OTP-based password reset via email                                       |
| 4 | **User Profile**          | Full profile management with avatar upload, education, work experience   |
| 5 | **Resume Builder**        | Multi-section resume builder with live preview & PDF export              |
| 6 | **Skill Gap Analyzer**    | Compare your skills against target roles, get learning roadmap           |
| 7 | **Job / Internship Finder** | Search real remote jobs from Remotive API with save/bookmark feature   |
| 8 | **Mock Interviews**       | Practice interviews with role-based questions and AI scoring             |
| 9 | **AI Career Chatbot**     | Chat with an AI career coach powered by Groq/Llama-3.3                  |
| 10 | **Dashboard**            | Central overview with charts, stats, and recent activity                 |
| 11 | **Google OAuth Login**   | One-click login/registration with Google account                        |

---

## 🛠️ Tech Stack

### Backend

| Technology             | Purpose                          | Version   |
| ---------------------- | -------------------------------- | --------- |
| **Node.js**            | Runtime environment              | v16+      |
| **Express.js**         | Web framework                    | ^4.18.2   |
| **MySQL**              | Relational database              | 8+        |
| **mysql2**             | MySQL driver (connection pooling)| ^3.11.3   |
| **jsonwebtoken**       | JWT authentication               | ^9.0.2    |
| **bcryptjs**           | Password hashing                 | ^2.4.3    |
| **nodemailer**         | Email sending (OTP)              | ^8.0.11   |
| **groq-sdk**           | Groq AI API client (chatbot)     | ^1.2.1    |
| **google-auth-library**| Google OAuth verification        | ^10.7.0   |
| **axios**              | HTTP client (external API calls) | ^1.5.0    |
| **helmet**             | Security headers                 | ^7.0.0    |
| **cors**               | Cross-Origin Resource Sharing    | ^2.8.5    |
| **express-rate-limit** | API rate limiting                | ^7.0.0    |
| **express-validator**  | Input validation                 | ^7.0.0    |
| **compression**        | Gzip response compression        | ^1.7.4    |
| **multer**             | File upload (avatar)             | ^2.1.1    |
| **openai**             | OpenAI SDK (optional)            | ^6.42.0   |
| **mongoose**           | MongoDB ODM (legacy models)      | ^8.0.0    |
| **redis**              | Caching (optional)               | ^4.6.8    |
| **dotenv**             | Environment variable management  | ^16.3.1   |
| **nodemon**            | Dev auto-restart                 | ^3.0.1    |

### Frontend

| Technology              | Purpose                         | Version   |
| ----------------------- | ------------------------------- | --------- |
| **React**               | UI library                      | ^18.2.0   |
| **Vite**                | Build tool & dev server         | ^5.0.2    |
| **React Router DOM**    | Client-side routing             | ^6.16.0   |
| **Zustand**             | State management                | ^4.4.0    |
| **Axios**               | HTTP client                     | ^1.5.0    |
| **Recharts**            | Dashboard charts                | ^2.8.0    |
| **Zod**                 | Schema validation               | ^3.22.4   |
| **Lucide React**        | Icon library                    | ^0.263.1  |
| **jsPDF**               | PDF generation (resume export)  | ^4.2.1    |
| **@react-oauth/google** | Google OAuth for React          | ^0.13.5   |
| **TailwindCSS**         | Utility-first CSS framework     | ^3.3.0    |
| **Vitest**              | Unit testing framework          | ^4.1.7    |
| **Testing Library**     | React component testing         | ^16.3.2   |

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│                                                          │
│  Pages → Components → Services → Axios API Client        │
│  State: Zustand Stores | Context: AuthContext             │
│  Routing: React Router v6 (lazy-loaded pages)             │
│  Styling: TailwindCSS | Charts: Recharts                  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP (REST API via Axios)
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Express.js on Node.js)          │
│                                                          │
│  Routes → Controllers → MySQL Pool (mysql2)              │
│  Middleware: JWT Auth, Rate Limiter, Helmet, CORS         │
│  External: Groq AI API, Remotive Jobs API, Gmail SMTP    │
│  Validation: express-validator | Error: centralized       │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
                      ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL 8+)                     │
│                                                          │
│  Tables: users, resumes, skill_gaps, jobs,               │
│          saved_jobs, interviews, chat_messages            │
│  Support: TiDB Cloud / Local XAMPP                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Modules Breakdown (Total: 8)

The application consists of **8 core modules**, each with its own backend routes/controllers and frontend components:

### Module 1: Authentication & Registration
- **Backend**: `routes/auth.js` → `controllers/authController.js`
- **Frontend**: `components/Auth/Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`
- **Features**:
  - User registration with email and password
  - Email OTP verification (6-digit code, 10-min expiry)
  - Login with email/password + JWT token issuance
  - Google OAuth 2.0 login (one-click sign-in)
  - Forgot password with OTP-based reset
  - Logout (client-side token removal)
  - Dev bypass login mode for development
- **API Endpoints**: 7

### Module 2: User Profile Management
- **Backend**: `routes/users.js` → `controllers/userController.js`
- **Frontend**: `components/Profile/ProfileForm.jsx`, `ProfileHeader.jsx`, `AvatarUpload.jsx`, `EducationSection.jsx`, `WorkExperienceSection.jsx`, `SkillsInput.jsx`
- **Features**:
  - View and edit user profile (name, phone, bio, location, etc.)
  - Upload/delete profile avatar (via Multer)
  - Add/edit/remove education entries (JSON array in MySQL)
  - Add/edit/remove work experience entries
  - Skills management (tag-based input)
  - Profile completion percentage calculation
- **API Endpoints**: 5

### Module 3: Resume Builder
- **Backend**: `routes/resume.js` → `controllers/resumeController.js`
- **Frontend**: `components/Resume/ResumeBuilder.jsx`, `PersonalInfoSection.jsx`, `ExperienceSection.jsx`, `ResumeEducationSection.jsx`, `ResumeSkillsSection.jsx`, `CertificationsSection.jsx`, `ProjectsSection.jsx`, `ResumePreview.jsx`, `ResumeTipsPanel.jsx`
- **Features**:
  - Multi-section resume creation (Personal Info, Experience, Education, Skills, Certifications, Projects)
  - Live preview while editing
  - PDF export using jsPDF
  - Resume tips panel for guidance
  - CRUD operations on resume data
- **API Endpoints**: 4

### Module 4: Skill Gap Analyzer
- **Backend**: `routes/skills.js` → `controllers/skillController.js`
- **Frontend**: `components/Skills/SkillGapAnalyzer.jsx`
- **Features**:
  - Browse predefined target roles (e.g., Frontend Developer, Data Scientist, etc.)
  - View required skills for each role
  - Run skill gap analysis (compares your skills vs. required skills)
  - Get match percentage, missing skills list, and learning roadmap
  - View analysis history
  - Delete past analyses
- **Data Source**: `data/skillRolesData.js` (18KB of role/skill data)
- **API Endpoints**: 6

### Module 5: Job / Internship Finder
- **Backend**: `routes/jobs.js` → `controllers/jobController.js`
- **Frontend**: `components/Jobs/JobFinder.jsx`
- **Features**:
  - Search for real remote jobs from Remotive API
  - Filter by keyword, location, and job type (job/internship)
  - Pagination support
  - View detailed job descriptions
  - Save/unsave (bookmark) jobs
  - Fallback to mock job data if the external API is unavailable
  - In-memory caching of job search results (5-minute TTL)
- **API Endpoints**: 5

### Module 6: Mock Interview
- **Backend**: `routes/interviews.js` → `controllers/interviewController.js`
- **Frontend**: `components/Interview/MockInterview.jsx`
- **Features**:
  - Browse available interview roles
  - Start a new mock interview session
  - Role-based interview questions (Technical, Behavioral, etc.)
  - Save answers incrementally
  - Submit interview for AI-powered scoring and feedback
  - View interview history with scores
  - View individual session details
- **Data Source**: `data/interviewQuestions.js` (135KB of curated questions)
- **API Endpoints**: 7

### Module 7: AI Career Chatbot
- **Backend**: `routes/ai.js` → `controllers/aiController.js`
- **Frontend**: `components/Chatbot/AIChatbot.jsx`
- **Features**:
  - Chat with an AI career coach in real-time
  - Topic-based conversations (career guidance, resume tips, interview prep, etc.)
  - Powered by Groq Cloud API (Llama 3.3-70B model)
  - Chat history persistence in MySQL
  - Fallback to offline rule-based replies when Groq API is unavailable
  - Context-aware responses using last 6 conversation turns
- **API Endpoints**: 2

### Module 8: Dashboard
- **Backend**: `routes/dashboard.js` → `controllers/dashboardController.js`
- **Frontend**: `components/Dashboard/Dashboard.jsx`
- **Features**:
  - Aggregated summary of all user data (profile, resume, jobs, skills, interviews, chatbot)
  - Profile completion percentage
  - Charts: Overview bar chart (saved jobs, skills, interviews, chat replies) and completion metrics
  - Recent activity feed (last 5 interviews and chatbot replies)
  - Quick-access navigation to all modules
- **API Endpoints**: 1

---

## 🔌 API Endpoints (Total: 34)

### 1. Authentication Routes — `POST /api/auth/*` (7 endpoints)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| POST   | `/api/auth/register`          | ❌    | Register new user                   |
| POST   | `/api/auth/verify-email`      | ❌    | Verify email with OTP               |
| POST   | `/api/auth/login`             | ❌    | Login with email/password           |
| POST   | `/api/auth/google`            | ❌    | Login/register with Google OAuth    |
| POST   | `/api/auth/forgot-password`   | ❌    | Request password reset OTP          |
| POST   | `/api/auth/reset-password`    | ❌    | Reset password with OTP             |
| POST   | `/api/auth/logout`            | ❌    | Logout                              |

### 2. User Profile Routes — `/api/users/*` (5 endpoints)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/users/profile`          | ✅    | Get user profile                    |
| PUT    | `/api/users/profile`          | ✅    | Update user profile                 |
| POST   | `/api/users/profile/avatar`   | ✅    | Upload avatar image                 |
| DELETE | `/api/users/profile/avatar`   | ✅    | Delete avatar image                 |
| DELETE | `/api/users/account`          | ✅    | Delete user account                 |

### 3. Resume Routes — `/api/resume/*` (4 endpoints)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/resume`                 | ✅    | Get user's resume                   |
| POST   | `/api/resume`                 | ✅    | Create new resume                   |
| PUT    | `/api/resume/:id`             | ✅    | Update existing resume              |
| DELETE | `/api/resume/:id`             | ✅    | Delete resume                       |

### 4. Skill Gap Routes — `/api/skills/*` (6 endpoints)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/skills/roles`           | ✅    | Get all available roles             |
| GET    | `/api/skills/roles/:role`     | ✅    | Get required skills for a role      |
| POST   | `/api/skills/analyze`         | ✅    | Run skill gap analysis              |
| GET    | `/api/skills/history`         | ✅    | Get analysis history                |
| GET    | `/api/skills/analysis/:id`    | ✅    | Get specific analysis details       |
| DELETE | `/api/skills/analysis/:id`    | ✅    | Delete an analysis                  |

### 5. Job Routes — `/api/jobs/*` (5 endpoints)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/jobs/search`            | ✅    | Search jobs (keyword, location, type)|
| GET    | `/api/jobs/saved`             | ✅    | Get saved/bookmarked jobs           |
| GET    | `/api/jobs/:jobId`            | ✅    | Get job details                     |
| POST   | `/api/jobs/save/:jobId`       | ✅    | Save/bookmark a job                 |
| DELETE | `/api/jobs/save/:jobId`       | ✅    | Remove saved job                    |

### 6. Interview Routes — `/api/interviews/*` (7 endpoints)

| Method | Endpoint                          | Auth | Description                          |
| ------ | --------------------------------- | ---- | ------------------------------------ |
| GET    | `/api/interviews/roles`           | ✅    | Get available interview roles        |
| GET    | `/api/interviews/questions`       | ✅    | Get interview questions for a role   |
| GET    | `/api/interviews/history`         | ✅    | Get interview session history        |
| GET    | `/api/interviews/:interviewId`    | ✅    | Get specific interview session       |
| POST   | `/api/interviews/start`           | ✅    | Start new mock interview             |
| PUT    | `/api/interviews/:interviewId/answers` | ✅ | Save answers for a session          |
| POST   | `/api/interviews/:interviewId/submit`  | ✅ | Submit interview for scoring        |

### 7. AI Chatbot Routes — `/api/ai/*` (2 endpoints)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/ai/history`             | ✅    | Get chat message history            |
| POST   | `/api/ai/chat`                | ✅    | Send message to AI assistant        |

### 8. Dashboard Routes — `/api/dashboard/*` (1 endpoint)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/dashboard/summary`      | ✅    | Get full dashboard summary          |

### 9. System Routes (1 endpoint)

| Method | Endpoint                      | Auth | Description                         |
| ------ | ----------------------------- | ---- | ----------------------------------- |
| GET    | `/api/health`                 | ❌    | Health check endpoint               |

---

## 🗃️ Database Schema (7 Tables)

The application uses **MySQL 8+** with **7 relational tables**. Schema is defined in `backend/db/init.sql`.

### Table 1: `users`
| Column                        | Type         | Description                           |
| ----------------------------- | ------------ | ------------------------------------- |
| `id`                          | VARCHAR(36)  | Primary key (UUID)                    |
| `name`                        | VARCHAR(100) | User's full name                      |
| `email`                       | VARCHAR(190) | Unique email address                  |
| `password_hash`               | VARCHAR(255) | bcrypt-hashed password                |
| `phone`                       | VARCHAR(30)  | Phone number                          |
| `bio`                         | TEXT         | User bio                              |
| `skills_json`                 | JSON         | Array of skills                       |
| `experience`                  | INT          | Years of experience                   |
| `github`                      | VARCHAR(255) | GitHub profile URL                    |
| `linkedin`                    | VARCHAR(255) | LinkedIn profile URL                  |
| `portfolio`                   | VARCHAR(255) | Portfolio website URL                 |
| `profile_image`               | VARCHAR(255) | Avatar image URL                      |
| `location`                    | VARCHAR(120) | Location                              |
| `university`                  | VARCHAR(120) | University name                       |
| `graduation_year`             | INT          | Graduation year                       |
| `target_role`                 | VARCHAR(120) | Target career role                    |
| `education_json`              | JSON         | Education entries array               |
| `work_experience_json`        | JSON         | Work experience entries array         |
| `email_verified`              | TINYINT(1)   | Email verification status             |
| `email_otp_code`              | VARCHAR(10)  | Current OTP code                      |
| `email_otp_expires_at`        | DATETIME     | OTP expiration timestamp              |
| `security_question_text`      | VARCHAR(255) | Security question                     |
| `security_question_answer_hash` | VARCHAR(255) | Hashed security answer              |
| `security_pin_hash`           | VARCHAR(255) | Hashed security PIN                   |
| `resume_id`                   | VARCHAR(36)  | FK to resumes table                   |
| `created_at`                  | DATETIME     | Account creation timestamp            |
| `updated_at`                  | DATETIME     | Last update timestamp (auto-update)   |

### Table 2: `resumes`
| Column               | Type         | Description                    |
| -------------------- | ------------ | ------------------------------ |
| `id`                 | VARCHAR(36)  | Primary key (UUID)             |
| `user_id`            | VARCHAR(36)  | FK → users.id (UNIQUE)        |
| `title`              | VARCHAR(120) | Resume title                   |
| `personal_info_json` | JSON         | Name, email, phone, etc.       |
| `experiences_json`   | JSON         | Work experience entries        |
| `education_json`     | JSON         | Education entries              |
| `skills_json`        | JSON         | Skills list                    |
| `certifications_json`| JSON         | Certifications list            |
| `projects_json`      | JSON         | Project entries                |
| `created_at`         | DATETIME     | Creation timestamp             |
| `updated_at`         | DATETIME     | Last update (auto-update)      |

### Table 3: `skill_gaps`
| Column                | Type          | Description                     |
| --------------------- | ------------- | ------------------------------- |
| `id`                  | VARCHAR(36)   | Primary key (UUID)              |
| `user_id`             | VARCHAR(36)   | FK → users.id                   |
| `target_role`         | VARCHAR(120)  | Target role analyzed            |
| `user_skills_json`    | JSON          | User's current skills           |
| `required_skills_json`| JSON          | Required skills for the role    |
| `matching_skills_json`| JSON          | Skills that match               |
| `missing_skills_json` | JSON          | Skills user is missing          |
| `match_percentage`    | DECIMAL(5,2)  | Match % (0–100)                 |
| `missing_details_json`| JSON          | Detailed info on missing skills |
| `roadmap_json`        | JSON          | Learning roadmap                |
| `recommendations_json`| JSON          | Skill recommendations           |
| `created_at`          | DATETIME      | Analysis timestamp              |

### Table 4: `jobs`
| Column                | Type          | Description                     |
| --------------------- | ------------- | ------------------------------- |
| `id`                  | BIGINT        | Auto-increment primary key      |
| `job_id`              | VARCHAR(120)  | Unique external job identifier  |
| `title`               | VARCHAR(255)  | Job title                       |
| `company`             | VARCHAR(255)  | Company name                    |
| `location`            | VARCHAR(255)  | Job location                    |
| `type`                | VARCHAR(60)   | Job type (Full-time, etc.)      |
| `description`         | TEXT          | Job description                 |
| `skills_json`         | JSON          | Required skills                 |
| `salary_json`         | JSON          | Salary information              |
| `posted_date`         | DATETIME      | Date job was posted             |
| `application_deadline`| DATETIME      | Application deadline            |
| `url`                 | TEXT          | Application URL                 |
| `source`              | VARCHAR(80)   | Data source (e.g., "remotive")  |
| `is_remote`           | TINYINT(1)    | Remote work flag                |
| `created_at`          | DATETIME      | Record creation timestamp       |

### Table 5: `saved_jobs`
| Column       | Type         | Description                          |
| ------------ | ------------ | ------------------------------------ |
| `user_id`    | VARCHAR(36)  | FK → users.id (composite PK)        |
| `job_id`     | VARCHAR(120) | FK → jobs.job_id (composite PK)     |
| `created_at` | DATETIME     | When the job was saved               |

### Table 6: `interviews`
| Column          | Type          | Description                         |
| --------------- | ------------- | ----------------------------------- |
| `id`            | VARCHAR(36)   | Primary key (UUID)                  |
| `user_id`       | VARCHAR(36)   | FK → users.id                       |
| `role`          | VARCHAR(120)  | Interview role                      |
| `category`      | VARCHAR(30)   | Category (Technical/Behavioral)     |
| `status`        | VARCHAR(30)   | Status (in_progress/completed)      |
| `questions_json`| JSON          | Questions with answers              |
| `total_duration`| INT           | Total time spent (seconds)          |
| `score`         | DECIMAL(5,2)  | Interview score                     |
| `feedback`      | TEXT          | AI-generated feedback               |
| `completed_at`  | DATETIME      | Completion timestamp                |
| `created_at`    | DATETIME      | Session creation timestamp          |

### Table 7: `chat_messages`
| Column       | Type         | Description                          |
| ------------ | ------------ | ------------------------------------ |
| `id`         | VARCHAR(36)  | Primary key (UUID)                   |
| `user_id`    | VARCHAR(36)  | FK → users.id                        |
| `role`       | VARCHAR(20)  | Message role (user/assistant)        |
| `topic`      | VARCHAR(50)  | Conversation topic                   |
| `content`    | TEXT         | Message content                      |
| `created_at` | DATETIME     | Message timestamp                    |

### Relationships & Constraints

- All tables with `user_id` have **ON DELETE CASCADE** foreign keys to `users.id`
- `resumes.user_id` is **UNIQUE** (one resume per user)
- `saved_jobs` uses a **composite primary key** (`user_id`, `job_id`)
- `saved_jobs.job_id` references `jobs.job_id` with **ON DELETE CASCADE**
- Indexes on `skill_gaps(user_id, created_at)`, `interviews(user_id, created_at)`, `chat_messages(user_id, created_at)` for efficient queries

---

## 🌐 External APIs & Services Used (4)

### 1. Groq Cloud API (AI Chatbot)
- **Purpose**: Powers the AI career chatbot
- **Model**: `llama-3.3-70b-versatile`
- **SDK**: `groq-sdk` (^1.2.1)
- **Env Var**: `GROQ_API_KEY`
- **Fallback**: Offline rule-based responses when API key is missing or API fails

### 2. Remotive API (Job Search)
- **Purpose**: Fetches real remote job listings
- **Endpoint**: `https://remotive.com/api/remote-jobs`
- **Method**: GET with query params (`search`, `limit`)
- **Caching**: In-memory cache with 5-minute TTL
- **Fallback**: Local mock job data from `data/fallbackJobs.js` when API is down

### 3. Gmail SMTP (Email Service)
- **Purpose**: Sends OTP emails for verification and password reset
- **Provider**: Gmail via `nodemailer`
- **SMTP Host**: `smtp.gmail.com` (port 587, STARTTLS)
- **Env Vars**: `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`
- **Templates**: HTML email templates for OTP verification, password reset, and welcome emails

### 4. Google OAuth 2.0 (Social Login)
- **Purpose**: Allow users to sign in with their Google account
- **Library Backend**: `google-auth-library` (^10.7.0)
- **Library Frontend**: `@react-oauth/google` (^0.13.5)
- **Env Vars**: `GOOGLE_CLIENT_ID` (both frontend & backend)
- **Flow**: Frontend receives Google token → backend verifies via `OAuth2Client.verifyIdToken()` → creates/updates user

---

## 🗺️ Frontend Pages & Routing (12 Routes)

All pages are **lazy-loaded** using `React.lazy()` for code splitting.

| Route              | Component          | Auth Required | Description                      |
| ------------------ | ------------------ | ------------- | -------------------------------- |
| `/`                | `HomePage`         | ❌            | Landing page                     |
| `/login`           | `Login`            | ❌            | Login page                       |
| `/register`        | `Register`         | ❌            | Registration page                |
| `/forgot-password` | `ForgotPassword`   | ❌            | Password reset page              |
| `/dashboard`       | `DashboardPage`    | ✅            | Dashboard overview               |
| `/profile`         | `ProfilePage`      | ✅            | Profile management               |
| `/resume`          | `ResumePage`       | ✅            | Resume builder                   |
| `/skills`          | `SkillsPage`       | ✅            | Skill gap analyzer               |
| `/jobs`            | `JobFinder`        | ✅            | Job search & saved jobs          |
| `/interview`       | `MockInterview`    | ✅            | Mock interview practice          |
| `/chatbot`         | `AIChatbot`        | ✅            | AI career chatbot                |
| `*`                | `NotFoundPage`     | ❌            | 404 page                         |

---

## 📊 State Management (6 Stores)

Uses **Zustand** for lightweight state management. Each module has its own store:

| Store File           | Purpose                              |
| -------------------- | ------------------------------------ |
| `profileStore.js`    | Profile data, update actions         |
| `resumeStore.js`     | Resume CRUD state                    |
| `skillStore.js`      | Skill gap analysis state             |
| `jobStore.js`        | Job search results, saved jobs       |
| `interviewStore.js`  | Interview sessions, questions        |
| `AuthContext.js`     | Auth state (React Context + hooks)   |

---

## 📡 Frontend Services (9 Services)

All services use an Axios instance configured in `services/api.js` with:
- Auto-attach JWT `Authorization: Bearer <token>` header
- Auto-redirect to `/login` on 401 responses

| Service File            | Purpose                                |
| ----------------------- | -------------------------------------- |
| `api.js`                | Axios instance with interceptors       |
| `authService.js`        | Login, register, verify email, etc.    |
| `profileService.js`     | Get/update profile, upload avatar      |
| `resumeService.js`      | Resume CRUD operations                 |
| `skillService.js`       | Skill roles, analysis, history         |
| `jobService.js`         | Job search, save/unsave jobs           |
| `interviewService.js`   | Interview sessions, submit answers     |
| `dashboardService.js`   | Fetch dashboard summary               |
| `aiService.js`          | AI chatbot messages, chat history      |

---

## 🧩 Frontend Components (42 Components)

### Auth Components (6)
| Component             | File                         | Description                           |
| --------------------- | ---------------------------- | ------------------------------------- |
| `Login`               | `Auth/Login.jsx`             | Login form with email/password + Google OAuth |
| `Register`            | `Auth/Register.jsx`          | Registration form with OTP verification |
| `ForgotPassword`      | `Auth/ForgotPassword.jsx`    | Password reset with OTP               |
| `Login.test`          | `Auth/Login.test.jsx`        | Unit test for Login component         |
| `Register.test`       | `Auth/Register.test.jsx`     | Unit test for Register component      |
| `ForgotPassword.test` | `Auth/ForgotPassword.test.jsx` | Unit test for ForgotPassword        |

### Profile Components (7)
| Component              | File                             | Description                    |
| ---------------------- | -------------------------------- | ------------------------------ |
| `ProfileForm`          | `Profile/ProfileForm.jsx`        | Full profile editing form      |
| `ProfileHeader`        | `Profile/ProfileHeader.jsx`      | Profile header with avatar     |
| `AvatarUpload`         | `Profile/AvatarUpload.jsx`       | Avatar upload with preview     |
| `EducationSection`     | `Profile/EducationSection.jsx`   | Education entries manager      |
| `WorkExperienceSection`| `Profile/WorkExperienceSection.jsx` | Work experience manager     |
| `SkillsInput`          | `Profile/SkillsInput.jsx`       | Tag-based skills input         |
| `SkillsInput.test`     | `Profile/SkillsInput.test.jsx`  | Unit test for SkillsInput      |

### Resume Components (11)
| Component                | File                                 | Description                 |
| ------------------------ | ------------------------------------ | --------------------------- |
| `ResumeBuilder`          | `Resume/ResumeBuilder.jsx`           | Main resume builder view    |
| `PersonalInfoSection`    | `Resume/PersonalInfoSection.jsx`     | Personal information form   |
| `ExperienceSection`      | `Resume/ExperienceSection.jsx`       | Work experience section     |
| `ResumeEducationSection` | `Resume/ResumeEducationSection.jsx`  | Education section           |
| `ResumeSkillsSection`    | `Resume/ResumeSkillsSection.jsx`     | Skills section              |
| `CertificationsSection`  | `Resume/CertificationsSection.jsx`   | Certifications section      |
| `ProjectsSection`        | `Resume/ProjectsSection.jsx`        | Projects section            |
| `ResumePreview`          | `Resume/ResumePreview.jsx`          | Live resume preview         |
| `ResumeTipsPanel`        | `Resume/ResumeTipsPanel.jsx`        | Resume writing tips         |
| `PersonalInfoSection.test` | `Resume/PersonalInfoSection.test.jsx` | Unit test              |
| `ResumeBuilder.test`    | `Resume/ResumeBuilder.test.jsx`      | Unit test for ResumeBuilder |

### Dashboard Components (2)
| Component          | File                          | Description                         |
| ------------------ | ----------------------------- | ----------------------------------- |
| `Dashboard`        | `Dashboard/Dashboard.jsx`     | Full dashboard with charts & stats  |
| `Dashboard.test`   | `Dashboard/Dashboard.test.jsx`| Unit test for Dashboard             |

### Skills Components (2)
| Component              | File                              | Description                      |
| ---------------------- | --------------------------------- | -------------------------------- |
| `SkillGapAnalyzer`     | `Skills/SkillGapAnalyzer.jsx`     | Skill gap analysis interface     |
| `SkillGapAnalyzer.test`| `Skills/SkillGapAnalyzer.test.jsx`| Unit test for SkillGapAnalyzer   |

### Jobs Components (2)
| Component         | File                     | Description                          |
| ----------------- | ------------------------ | ------------------------------------ |
| `JobFinder`       | `Jobs/JobFinder.jsx`     | Job search, filter, save interface   |
| `JobFinder.test`  | `Jobs/JobFinder.test.jsx`| Unit test for JobFinder              |

### Interview Components (2)
| Component           | File                              | Description                    |
| ------------------- | --------------------------------- | ------------------------------ |
| `MockInterview`     | `Interview/MockInterview.jsx`     | Interview practice UI          |
| `MockInterview.test`| `Interview/MockInterview.test.jsx`| Unit test for interviews       |

### Chatbot Components (2)
| Component          | File                         | Description                          |
| ------------------ | ---------------------------- | ------------------------------------ |
| `AIChatbot`        | `Chatbot/AIChatbot.jsx`     | AI chatbot conversation UI           |
| `AIChatbot.test`   | `Chatbot/AIChatbot.test.jsx`| Unit test for AIChatbot              |

### Common/Layout Components (4)
| Component        | File                          | Description                       |
| ---------------- | ----------------------------- | --------------------------------- |
| `Navbar`         | `Common/Navbar.jsx`           | Top navigation bar                |
| `Sidebar`        | `Common/Sidebar.jsx`          | Side navigation menu              |
| `AppLayout`      | `Common/AppLayout.jsx`        | Layout wrapper (Navbar + Sidebar) |
| `ProtectedRoute` | `Common/ProtectedRoute.jsx`   | Auth guard for protected pages    |

### Page Components (6)
| Component        | File                        | Description                      |
| ---------------- | --------------------------- | -------------------------------- |
| `HomePage`       | `pages/HomePage.jsx`        | Public landing page              |
| `DashboardPage`  | `pages/DashboardPage.jsx`   | Dashboard page wrapper           |
| `ProfilePage`    | `pages/ProfilePage.jsx`     | Profile page wrapper             |
| `ResumePage`     | `pages/ResumePage.jsx`      | Resume page wrapper              |
| `SkillsPage`     | `pages/SkillsPage.jsx`     | Skills page wrapper              |
| `NotFoundPage`   | `pages/NotFoundPage.jsx`   | 404 error page                   |

---

## 🛡️ Middleware (3 Middleware)

| Middleware           | File                           | Description                          |
| -------------------- | ------------------------------ | ------------------------------------ |
| `protect`            | `middleware/auth.js`           | JWT token verification & user injection |
| `errorHandler`       | `middleware/errorHandler.js`   | Centralized error response handler   |
| `uploadAvatar`       | `middleware/uploadMiddleware.js`| Multer config for avatar uploads     |

---

## 🔧 Utility Modules (13 Utilities)

### Backend Utilities (9 files — `backend/utils/`)

| Utility              | File                    | Description                                  |
| -------------------- | ----------------------- | -------------------------------------------- |
| `chatPrompts`        | `chatPrompts.js`        | Topic-based system prompts for AI chatbot    |
| `chatProvider`       | `chatProvider.js`       | Groq API integration with fallback           |
| `dbHelpers`          | `dbHelpers.js`          | UUID generator, JSON parser, profile completion calculator |
| `devAuth`            | `devAuth.js`            | Dev bypass auth (auto-login in development)  |
| `emailService`       | `emailService.js`       | Nodemailer email sending (OTP, welcome)      |
| `interviewScoring`   | `interviewScoring.js`   | Interview answer scoring logic               |
| `jobProvider`        | `jobProvider.js`        | Remotive API integration + caching + fallback|
| `simpleCache`        | `simpleCache.js`        | In-memory TTL cache for API responses        |
| `validators`         | `validators.js`         | Express-validator rules for all endpoints    |

### Frontend Utilities (4 files — `frontend/src/utils/`)

| Utility              | File                    | Description                                  |
| -------------------- | ----------------------- | -------------------------------------------- |
| `generateResumePDF`  | `generateResumePDF.js`  | jsPDF-based resume PDF generation            |
| `resumeTips`         | `resumeTips.js`         | Predefined resume writing tips               |
| `validators`         | `validators.js`         | Zod schemas for form validation              |
| `validators.test`    | `validators.test.js`    | Unit tests for validators                    |

---

## 🔐 Authentication Flow

```
1. REGISTRATION
   User fills form → POST /api/auth/register
   → Password hashed (bcrypt) → User created in MySQL
   → 6-digit OTP generated → Emailed via Gmail SMTP
   → User enters OTP → POST /api/auth/verify-email
   → email_verified = true ✓

2. LOGIN (Email/Password)
   User enters credentials → POST /api/auth/login
   → Email checked → Password verified (bcrypt.compare)
   → If email not verified → Re-send OTP, return step: "emailVerification"
   → If verified → Generate JWT + Refresh Token
   → Return tokens + user data ✓

3. LOGIN (Google OAuth)
   User clicks "Sign in with Google" → Google returns ID token
   → POST /api/auth/google with Google token
   → Backend verifies token via google-auth-library
   → If user exists → Link Google ID, return JWT
   → If new user → Create account (auto email verified), return JWT ✓

4. PASSWORD RESET
   User enters email → POST /api/auth/forgot-password
   → OTP generated & emailed
   → User enters OTP + new password → POST /api/auth/reset-password
   → OTP verified → Password updated ✓

5. TOKEN MANAGEMENT
   - JWT Access Token: 7-day expiry (stored in localStorage)
   - Refresh Token: 30-day expiry
   - Auto-redirect to /login on 401 response (via Axios interceptor)
```

---

## 🔒 Security Features

| Feature                  | Implementation                                       |
| ------------------------ | ---------------------------------------------------- |
| **Password Hashing**     | bcrypt with salt rounds = 10                         |
| **JWT Authentication**   | Access token (7d) + Refresh token (30d)              |
| **Email OTP**            | 6-digit code with 10-minute expiry                   |
| **HTTP Security Headers**| Helmet.js middleware                                 |
| **CORS**                 | Configurable origin whitelist                        |
| **Rate Limiting**        | express-rate-limit (configurable window + max requests) |
| **Input Validation**     | express-validator (backend) + Zod (frontend)         |
| **Error Handling**       | Centralized error middleware (no stack traces in production) |
| **Response Compression** | Gzip via compression middleware                      |
| **File Upload Security** | Multer with size limits and file type validation     |
| **Dev Bypass Auth**      | Configurable dev-only bypass (disabled in production)|

---

## 🧪 Testing (100+ Test Cases across 20 Test Files)

### Backend Unit Tests (5 files, ~43 test cases)
- **Framework**: Node.js built-in test runner (`node --test`)
- **Location**: `backend/tests/`
- **Files**:
  - `unit.test.mjs` — Email/password validators, interview scoring (8 tests)
  - `dbHelpers.test.mjs` — UUID generation, JSON helpers, profile completion, user mapping (14 tests)
  - `chatPrompts.test.mjs` — Topic detection, fallback replies, prompt map (11 tests)
  - `simpleCache.test.mjs` — Cache set/get, TTL expiry, deletion, prefix clearing (10 tests)
  - `smoke.mjs` — Smoke tests for 8 API endpoints (requires running server)

**Run backend tests:**
```bash
cd backend
npm test            # runs both unit + smoke tests
npm run test:unit   # unit tests only
npm run test:smoke  # smoke tests only
```

### Frontend Component & Unit Tests (12 files, ~70 test cases)
- **Framework**: Vitest + @testing-library/react
- **Location**: Tests co-located with components (`.test.jsx` files)
- **Files**:
  - `components/Auth/Login.test.jsx` — Login flow, error handling (2 tests)
  - `components/Auth/Register.test.jsx` — Registration, OTP verification, input sanitization (7 tests)
  - `components/Auth/ForgotPassword.test.jsx` — Password reset flow, dev OTP, errors (7 tests)
  - `components/Dashboard/Dashboard.test.jsx` — Summary cards, charts, activity, states (10 tests)
  - `components/Resume/ResumeBuilder.test.jsx` — Resume CRUD, preview, save states (9 tests)
  - `components/Resume/PersonalInfoSection.test.jsx` — Personal info rendering & updates (2 tests)
  - `components/Skills/SkillGapAnalyzer.test.jsx` — Role selection, analysis, history (10 tests)
  - `components/Jobs/JobFinder.test.jsx` — Search, cards, modal, pagination, fallback (14 tests)
  - `components/Interview/MockInterview.test.jsx` — Interview sessions, answers, store (3 tests)
  - `components/Chatbot/AIChatbot.test.jsx` — Messages, history, topics, fallback (9 tests)
  - `components/Profile/SkillsInput.test.jsx` — Skill badges, removal (3 tests)
  - `utils/validators.test.js` — Email, password, form validation (3 tests)

**Run frontend tests:**
```bash
cd frontend
npm test            # run all tests once
npm run test:watch  # run in watch mode
```

### E2E / GUI Tests (5 files, ~18 test cases)
- **Location**: `e2e/` directory
- **Tools**: Selenium WebDriver (Python + Node.js)
- **Files**:
  - `test_gui_modules.py` — Login, resume, interview GUI tests (4 tests)
  - `tests/auth-and-core.test.mjs` — Auth, resume save, interview scoring (4 tests)
  - `tests/forms.test.mjs` — Profile, job search, skill analysis (3 tests)
  - `tests/interactions.test.mjs` — Chatbot, job modal, logout (3 tests)
  - `tests/navigation.test.mjs` — Sidebar, protected routes, navbar (4 tests)
- **Features**: Docker Compose Selenium Grid for parallel browser testing

### Performance Tests
- **Tool**: Apache JMeter
- **Location**: `jmeter/` directory
- **Test Plan**: `ai-career-launchpad-core-modules.jmx` — load testing all core API endpoints
- **Runner Script**: `run-jmeter.ps1` (PowerShell)

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** v16 or higher
- **npm** (comes with Node.js)
- **MySQL 8+** (local via XAMPP, or cloud via TiDB/PlanetScale)

### Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd ai-career-launchpad

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure backend environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# 4. Initialize the database
# Make sure MySQL is running, then:
node init-tidb.mjs
# Or import db/init.sql manually into your MySQL instance

# 5. Start backend server
npm run dev
# Server runs on http://localhost:5000

# 6. Install frontend dependencies (new terminal)
cd ../frontend
npm install

# 7. Start frontend dev server
npm run dev
# App runs on http://localhost:5173
```

### Using Setup Scripts

```bash
# Windows
setup.bat

# macOS / Linux
chmod +x setup.sh
./setup.sh
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable                | Required | Default                  | Description                           |
| ----------------------- | -------- | ------------------------ | ------------------------------------- |
| `PORT`                  | No       | `5000`                   | Server port                           |
| `NODE_ENV`              | No       | `development`            | Environment mode                      |
| `DATABASE_URL`          | No*      | —                        | Full MySQL connection string          |
| `DB_HOST`               | No*      | `127.0.0.1`              | MySQL host                            |
| `DB_PORT`               | No*      | `3306`                   | MySQL port                            |
| `DB_USER`               | No*      | `root`                   | MySQL user                            |
| `DB_PASSWORD`           | No*      | (empty)                  | MySQL password                        |
| `DB_NAME`               | No*      | `ai_career_launchpad`    | MySQL database name                   |
| `JWT_SECRET`            | Yes      | (fallback provided)      | JWT signing secret                    |
| `JWT_EXPIRE`            | No       | `7d`                     | JWT access token expiry               |
| `REFRESH_TOKEN_SECRET`  | No       | (fallback provided)      | JWT refresh token secret              |
| `GROQ_API_KEY`          | No       | —                        | Groq API key for AI chatbot           |
| `GOOGLE_CLIENT_ID`      | No       | —                        | Google OAuth Client ID                |
| `EMAIL_USER`            | No       | —                        | Gmail address for sending emails      |
| `EMAIL_PASSWORD`        | No       | —                        | Gmail App Password                    |
| `EMAIL_FROM`            | No       | —                        | "From" email address                  |
| `FRONTEND_URLS`         | No       | —                        | Comma-separated allowed frontend URLs |
| `RATE_LIMIT_WINDOW`     | No       | `15`                     | Rate limit window (minutes)           |
| `RATE_LIMIT_MAX_REQUESTS`| No     | `100`                    | Max requests per window               |
| `DEV_BYPASS_AUTH`       | No       | `false`                  | Enable dev login bypass               |
| `DEV_LOGIN_EMAIL`       | No       | —                        | Dev bypass email                      |
| `DEV_LOGIN_PASSWORD`    | No       | —                        | Dev bypass password                   |

> \* Either `DATABASE_URL` OR individual `DB_*` variables are required.

### Frontend (`frontend/.env`)

| Variable                  | Required | Description                    |
| ------------------------- | -------- | ------------------------------ |
| `VITE_API_URL`            | Yes      | Backend API base URL           |
| `VITE_APP_NAME`           | No       | Application display name       |
| `VITE_GOOGLE_CLIENT_ID`   | No       | Google OAuth Client ID         |
| `VITE_DEV_LOGIN_EMAIL`    | No       | Dev bypass email (shown on login) |
| `VITE_DEV_LOGIN_PASSWORD` | No       | Dev bypass password            |

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

Both the frontend and backend are pre-configured for **Vercel** deployment:

**Backend** (`backend/vercel.json`):
- Uses `@vercel/node` build adapter
- Routes all `/api/*` requests to `server.js`
- CORS headers automatically configured

**Frontend** (`frontend/vercel.json`):
- SPA rewrite rules for client-side routing

### Deployment Steps

1. **Deploy Backend** to Vercel:
   ```bash
   cd backend
   vercel --prod
   ```

2. **Deploy Frontend** to Vercel:
   ```bash
   cd frontend
   vercel --prod
   ```

3. Update `VITE_API_URL` in frontend to point to backend URL.

### Alternative Hosting Options

| Service    | Type      | Backend | Frontend |
| ---------- | --------- | ------- | -------- |
| **Vercel** | Serverless| ✅       | ✅        |
| **Railway**| PaaS      | ✅       | ❌        |
| **Render** | PaaS      | ✅       | ✅        |
| **Netlify**| Static    | ❌       | ✅        |

### Database Hosting Options

| Service          | Type             | Free Tier |
| ---------------- | ---------------- | --------- |
| **TiDB Cloud**   | MySQL-compatible | ✅         |
| **PlanetScale**  | MySQL serverless | ✅         |
| **AWS RDS**      | Managed MySQL    | ✅ (12 months) |
| **Local XAMPP**   | Local MySQL     | ✅         |

---

## 📁 Project File Structure

```
ai-career-launchpad/
├── backend/
│   ├── config/
│   │   ├── db.js                     # Legacy DB config
│   │   └── mysql.js                  # MySQL connection pool & init
│   ├── controllers/
│   │   ├── aiController.js           # AI chatbot logic
│   │   ├── authController.js         # Auth: register, login, verify, reset
│   │   ├── dashboardController.js    # Dashboard summary aggregation
│   │   ├── interviewController.js    # Interview sessions & scoring
│   │   ├── jobController.js          # Job search, save, details
│   │   ├── resumeController.js       # Resume CRUD
│   │   ├── skillController.js        # Skill gap analysis
│   │   └── userController.js         # User profile management
│   ├── data/
│   │   ├── fallbackJobs.js           # Fallback job listings (offline mode)
│   │   ├── interviewQuestions.js      # 135KB curated interview questions
│   │   └── skillRolesData.js         # Role-skill mappings for gap analysis
│   ├── db/
│   │   └── init.sql                  # MySQL schema (7 tables)
│   ├── middleware/
│   │   ├── auth.js                   # JWT verification + token generation
│   │   ├── errorHandler.js           # Centralized error middleware
│   │   └── uploadMiddleware.js       # Multer avatar upload config
│   ├── models/
│   │   ├── ChatMessage.js            # Mongoose model (legacy)
│   │   ├── Interview.js              # Mongoose model (legacy)
│   │   ├── Job.js                    # Mongoose model (legacy)
│   │   ├── Resume.js                 # Mongoose model (legacy)
│   │   ├── SkillGap.js              # Mongoose model (legacy)
│   │   └── User.js                   # Mongoose model (legacy)
│   ├── routes/
│   │   ├── ai.js                     # AI chatbot routes (2 endpoints)
│   │   ├── auth.js                   # Auth routes (7 endpoints)
│   │   ├── dashboard.js              # Dashboard routes (1 endpoint)
│   │   ├── interviews.js             # Interview routes (7 endpoints)
│   │   ├── jobs.js                   # Job routes (5 endpoints)
│   │   ├── resume.js                 # Resume routes (4 endpoints)
│   │   ├── skills.js                 # Skill routes (6 endpoints)
│   │   └── users.js                  # User routes (5 endpoints)
│   ├── tests/
│   │   ├── chatPrompts.test.mjs      # Chat prompts unit tests
│   │   ├── dbHelpers.test.mjs        # DB helpers unit tests
│   │   ├── simpleCache.test.mjs      # Cache unit tests
│   │   ├── smoke.mjs                 # Smoke tests
│   │   └── unit.test.mjs             # Core unit tests
│   ├── uploads/                      # User avatar uploads directory
│   ├── utils/
│   │   ├── chatPrompts.js            # AI system prompts by topic
│   │   ├── chatProvider.js           # Groq API client + fallback
│   │   ├── dbHelpers.js              # UUID, JSON parser, profile calc
│   │   ├── devAuth.js                # Dev bypass authentication
│   │   ├── emailService.js           # Nodemailer email service
│   │   ├── interviewScoring.js       # Interview scoring algorithm
│   │   ├── jobProvider.js            # Remotive API + cache + fallback
│   │   ├── simpleCache.js            # In-memory TTL cache
│   │   └── validators.js             # express-validator validation rules
│   ├── .env.example                  # Environment variable template
│   ├── .gitignore
│   ├── init-tidb.mjs                 # TiDB Cloud DB initialization
│   ├── package.json
│   ├── server.js                     # Express app entry point
│   ├── test-tables.mjs               # DB table verification script
│   └── vercel.json                   # Vercel deployment config
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/                 # Login, Register, ForgotPassword (+tests)
│   │   │   ├── Chatbot/              # AIChatbot (+test)
│   │   │   ├── Common/               # Navbar, Sidebar, AppLayout, ProtectedRoute
│   │   │   ├── Dashboard/            # Dashboard (+test)
│   │   │   ├── Interview/            # MockInterview (+test)
│   │   │   ├── Jobs/                 # JobFinder (+test)
│   │   │   ├── Profile/              # ProfileForm, AvatarUpload, Education, etc. (+test)
│   │   │   ├── Resume/               # ResumeBuilder, sections, preview, tips (+tests)
│   │   │   └── Skills/               # SkillGapAnalyzer (+test)
│   │   ├── context/
│   │   │   ├── AuthContext.js         # Authentication context provider
│   │   │   ├── interviewStore.js      # Interview Zustand store
│   │   │   ├── jobStore.js            # Job search Zustand store
│   │   │   ├── profileStore.js        # Profile Zustand store
│   │   │   ├── resumeStore.js         # Resume Zustand store
│   │   │   └── skillStore.js          # Skill gap Zustand store
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # Auth hook (login, logout, check auth)
│   │   │   └── useFetch.js            # Generic data fetching hook
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx      # Dashboard page
│   │   │   ├── HomePage.jsx           # Landing/home page
│   │   │   ├── NotFoundPage.jsx       # 404 page
│   │   │   ├── ProfilePage.jsx        # Profile page
│   │   │   ├── ResumePage.jsx         # Resume page
│   │   │   └── SkillsPage.jsx         # Skills page
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance with interceptors
│   │   │   ├── aiService.js           # AI chatbot API calls
│   │   │   ├── authService.js         # Auth API calls
│   │   │   ├── dashboardService.js    # Dashboard API calls
│   │   │   ├── interviewService.js    # Interview API calls
│   │   │   ├── jobService.js          # Job API calls
│   │   │   ├── profileService.js      # Profile API calls
│   │   │   ├── resumeService.js       # Resume API calls
│   │   │   └── skillService.js        # Skill gap API calls
│   │   ├── styles/
│   │   │   └── App.css                # Global application styles
│   │   ├── utils/
│   │   │   ├── generateResumePDF.js   # PDF generation utility
│   │   │   ├── resumeTips.js          # Resume writing tips data
│   │   │   ├── validators.js          # Zod validation schemas
│   │   │   └── validators.test.js     # Validator unit tests
│   │   ├── App.jsx                    # Root component with routing
│   │   └── main.jsx                   # React entry point
│   ├── .env                           # Frontend environment variables
│   ├── .gitignore
│   ├── index.html                     # HTML entry point
│   ├── package.json
│   ├── postcss.config.js              # PostCSS config
│   ├── tailwind.config.cjs            # TailwindCSS config (CJS)
│   ├── tailwind.config.js             # TailwindCSS config (ESM)
│   ├── vercel.json                    # Vercel deployment config
│   └── vite.config.js                 # Vite build configuration
│
├── e2e/                               # End-to-end / GUI tests
│   ├── tests/                         # Test scripts
│   │   ├── auth-and-core.test.mjs     # Auth & core feature tests
│   │   ├── forms.test.mjs             # Form interaction tests
│   │   ├── interactions.test.mjs      # UI interaction tests
│   │   └── navigation.test.mjs        # Navigation & routing tests
│   ├── helpers/                       # Test helpers
│   ├── scripts/                       # Test runner scripts
│   ├── screenshots/                   # Test screenshots
│   ├── recorded/                      # Recorded test sessions
│   ├── test_gui_modules.py            # Selenium GUI tests (Python)
│   ├── test_gui_modules.mjs           # Selenium GUI tests (Node.js)
│   ├── test_grid_parallel.mjs         # Parallel browser testing
│   ├── run_all_tests.mjs              # Node.js test runner
│   ├── docker-compose.grid.yml        # Selenium Grid config
│   └── package.json                   # E2E dependencies
│
├── jmeter/                            # Performance tests
│   ├── ai-career-launchpad-core-modules.jmx  # JMeter test plan
│   ├── run-jmeter.ps1                 # JMeter runner script (PowerShell)
│   ├── PERFORMANCE_TEST_RESULTS.md    # Performance test results
│   ├── JMETER_REPORT_CAPTIONS.md     # Report captions & analysis
│   └── README.md                      # JMeter usage guide
│
├── .gitignore
├── package.json                       # Root package (dev scripts)
├── setup.bat                          # Windows setup script
├── setup.sh                           # Unix setup script
├── generate_docx.py                   # Report generation script
├── generate_quiz.py                   # Quiz generation script
├── generate_real_quiz.mjs             # Quiz generation (Node.js)
├── generate_real_quiz_fast.py         # Fast quiz generation (Python)
├── GUI_TESTING_REPORT.docx            # GUI testing report document
└── README.md                          # This file
```

---

## 📜 NPM Scripts

### Root (`package.json`)
```bash
npm run dev:backend     # Start backend with nodemon
npm run dev:frontend    # Start frontend Vite dev server
npm run build:backend   # Build backend
npm run build:frontend  # Build frontend (vite build)
npm start               # Start backend production server
```

### Backend (`backend/package.json`)
```bash
npm start               # node server.js
npm run dev             # nodemon server.js (hot reload)
npm test                # Run unit + smoke tests
npm run test:unit       # Run unit tests only
npm run test:smoke      # Run smoke tests only
```

### Frontend (`frontend/package.json`)
```bash
npm run dev             # vite (dev server on port 5173)
npm run build           # vite build (production bundle)
npm run preview         # vite preview (preview production build)
npm run lint            # ESLint check
npm test                # vitest run (run all tests)
npm run test:watch      # vitest (watch mode)
```

---

## 🔧 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
→ Ensure MySQL is running (start XAMPP/MySQL service) or check `DB_HOST`/`DB_PORT` in `.env`.

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
→ Check `FRONTEND_URLS` in backend `.env` matches your frontend URL (e.g., `http://localhost:5173`).

### Email Not Sending
```
Error: Invalid login: 534
```
→ Use a **Gmail App Password**, not your regular Gmail password. Enable 2FA first at https://myaccount.google.com/apppasswords.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
→ Change `PORT` in backend `.env` or kill the process using that port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Groq API Key Missing
```
GROQ_API_KEY is missing. Using offline fallback mode.
```
→ The chatbot will use rule-based fallback responses. Get a free API key from https://console.groq.com/.

### JWT Secret Warning
→ Change default JWT secrets in production. Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔮 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Video interview recorder
- [ ] AI-powered resume scoring
- [ ] Skill recommendations from job market trends
- [ ] LinkedIn profile integration
- [ ] GitHub profile analysis
- [ ] Payment gateway for premium features
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] WebSocket for live collaboration
- [ ] Redis caching layer (infrastructure ready)

---

## 📊 Project Summary Statistics

| Metric                     | Count   |
| -------------------------- | ------- |
| **Total Modules**          | 8       |
| **Total API Endpoints**    | 34 + 1 health check |
| **Database Tables**        | 7       |
| **External APIs/Services** | 4       |
| **Frontend Routes**        | 12      |
| **React Components**       | 42 (including tests) |
| **Frontend Services**      | 9       |
| **Zustand Stores**         | 5 + 1 Context |
| **Backend Middleware**      | 3       |
| **Backend Utilities**      | 9       |
| **Frontend Utilities**     | 4       |
| **Backend Dependencies**   | 17 production + 1 dev |
| **Frontend Dependencies**  | 10 production + 7 dev |
| **Test Files**             | 20+ (100+ test cases) |
| **E2E Test Files**         | 5       |
| **Performance Test Plans** | 1 (JMeter) |

---

## 📄 License

MIT License — Feel free to use for university projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💬 Support

For issues or questions, create a GitHub issue or contact the development team.

---

<p align="center">
  <strong>Ready to launch your career? Start building! 🚀</strong>
</p>
