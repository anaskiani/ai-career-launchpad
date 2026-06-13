# Quick Start Guide

Get AI Career Launchpad running in 5 minutes!

## 1. Clone/Open Project
```bash
cd d:\SEM 6 Anas\ai-career-launchpad
```

## 2. Start MySQL
The app uses **MySQL** (not MongoDB).

**Option A: XAMPP (Windows — recommended)**
1. Install XAMPP if needed
2. Start **MySQL** from XAMPP Control Panel, or run `C:\xampp\mysql_start.bat`
3. Default connection: `127.0.0.1:3306`, user `root`, empty password

**Option B: Standalone MySQL**
- Install MySQL 8+ and ensure the service is running on port 3306

Tables are created automatically from `backend/db/init.sql` on first backend start.

## 3. Configure Backend

```bash
cd backend
```

Edit `.env` (key values):
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_career_launchpad

# Development login (skips OTP / security steps):
DEV_BYPASS_AUTH=true
DEV_LOGIN_EMAIL=dev@localhost.com
DEV_LOGIN_PASSWORD=devpassword

# Email (optional — for registration OTP & forgot password):
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Paid APIs (optional — app works without them):
# OPENROUTER_API_KEY=
# RAPIDAPI_KEY=
```

**For Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select Mail & Windows App
3. Copy the 16-char password
4. Paste into `EMAIL_PASSWORD`

## 4. Start Backend

```bash
npm run dev
```

✓ Should see: `🚀 Server running on port 5000`

## 5. Configure Frontend

```bash
cd ../frontend
```

`.env` is already configured (no changes needed)

## 6. Start Frontend

```bash
npm run dev
```

✓ Should see: `Local:   http://localhost:5173/`

## 7. Test the App

Open http://localhost:5173 in your browser

### Quick dev login (no OTP)
- Email: `dev@localhost.com`
- Password: `devpassword`

### Try these:
1. **Homepage** → Explore features
2. **Login** → Use dev credentials above (or register for full 3-factor flow)
3. **Profile** → Add skills and target role
4. **Skills** → Run gap analysis
5. **Resume** → Build and export PDF
6. **Jobs** → Search (demo listings if no RapidAPI key)
7. **Interview** → Submit for local scoring/feedback
8. **Chatbot** → Offline career coach
9. **Dashboard** → See aggregated progress

See **DEMO_PATH.md** for a full 10-minute demo script.

---

## Common Issues

### MySQL not connecting?
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
→ Start MySQL (XAMPP or Windows service) and check `DB_*` in `backend/.env`

### CORS errors?
```
Access blocked by CORS policy
```
→ Make sure backend is running on port 5000

### Email not sending?
→ Set `EMAIL_USER` and `EMAIL_PASSWORD` in backend `.env`  
→ In development, OTP appears in terminal console

### Port already in use?
```bash
# Change PORT in .env, or:
netstat -ano | findstr :5000  # Find what's using it
taskkill /PID <PID> /F         # Kill the process
```

---

## Project Commands

### Backend
```bash
cd backend

npm run dev              # Start dev server with auto-reload
npm install             # Install dependencies
npm start               # Start production server
npm audit               # Check vulnerabilities
```

### Frontend
```bash
cd frontend

npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm install             # Install dependencies
```

---

## What's Included

✅ **Authentication**
- Registration with validation
- Email OTP verification
- Security question verification
- Security PIN verification
- JWT tokens

✅ **User Management**
- Profile viewing
- Profile editing
- Account deletion

✅ **UI Components**
- Responsive navbar
- Sidebar navigation
- Protected routes
- Dashboard with charts
- Login/Register forms

✅ **Database**
- User model with 3FA
- Resume schema
- Job schema
- Interview schema
- Skill gap schema

✅ **API Routes**
- All auth endpoints
- User endpoints
- Resume endpoints (placeholder)
- Job endpoints (placeholder)
- Skills endpoints (placeholder)
- Interview endpoints (placeholder)

---

## Next Steps

After testing, implement these features:

1. **Resume Builder** (components/Resume/)
   - Add form for experiences, education, skills
   - PDF export functionality

2. **Job Finder** (components/Jobs/)
   - Integrate RapidAPI JSearch
   - Display job listings
   - Save/apply to jobs

3. **Skill Gap Analyzer** (components/Skills/)
   - Compare user skills vs job requirements
   - Generate recommendations
   - Show skill charts

4. **Mock Interviews** (components/Interview/)
   - Display questions
   - Record answers
   - Provide feedback

5. **AI Chatbot** (components/Chatbot/)
   - Integrate OpenAI API
   - Career guidance conversations
   - Resume review

---

## File Structure Reference

```
backend/
├── controllers/authController.js      # Auth logic (3FA)
├── models/User.js                     # User schema with 3FA
├── middleware/auth.js                 # JWT protection
├── routes/auth.js                     # Auth endpoints
├── utils/emailService.js              # Email OTP sending
└── server.js                          # Main server file

frontend/
├── components/Auth/Login.jsx          # 3FA login form
├── components/Auth/Register.jsx       # 3FA registration form
├── components/Dashboard/Dashboard.jsx # Dashboard with charts
├── components/Profile/ProfileForm.jsx # Profile editing
├── pages/HomePage.jsx                 # Landing page
└── App.jsx                            # Main routing
```

---

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: Hash,
  emailOTP: { code, expiresAt },
  emailVerified: Boolean,
  securityQuestion: { question, answer (hashed) },
  securityPIN: { pin (hashed), createdAt },
  skills: [String],
  experience: Number,
  github, linkedin, portfolio: URLs
}
```

---

## Tips for University Project

✅ Document your work (README included)  
✅ Clean code structure (folders organized)  
✅ Comment important sections  
✅ Test authentication flow thoroughly  
✅ Show 3FA implementation (unique feature)  
✅ Use free tools/APIs only  
✅ Keep README updated  

---

## Production Checklist

Before deployment:
- [ ] Change JWT secrets in `.env`
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Setup error logging
- [ ] Test all APIs thoroughly
- [ ] Optimize database queries
- [ ] Remove console.logs from production code
- [ ] Setup monitoring/alerts
- [ ] Create backup strategy

---

**You're all set! Happy coding! 🚀**

Need help? Check the full README.md or create GitHub issues.
