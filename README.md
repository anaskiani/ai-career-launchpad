# AI Career Launchpad

A comprehensive MERN stack web application for university students to accelerate their career growth with AI-powered tools.

## Features

✨ **3-Factor Authentication**: Password + Email OTP + Security Question/PIN  
📄 **Resume Builder**: Create professional resumes with AI assistance  
⚡ **Skill Gap Analyzer**: Identify skills you need to improve  
💼 **Job/Internship Finder**: Discover perfect career opportunities  
🎯 **Mock Interviews**: Practice with AI-powered interview questions  
🤖 **AI Chatbot**: Get personalized career guidance  
📊 **Dashboard**: Track your progress and achievements  

---

## Tech Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MySQL (via mysql2)
- **Authentication**: JWT + 3-Factor Auth
- **Email**: Nodemailer (Gmail)
- **Security**: Helmet, CORS, Rate Limiting, bcryptjs
- **Performance**: Compression, Caching-ready with Redis

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Validation**: Zod

---

## Project Structure

```
ai-career-launchpad/
├── backend/
│   ├── config/          # Database & JWT configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── middleware/      # Auth & error handling
│   ├── routes/          # API routes
│   ├── utils/           # Helpers (email, validators)
│   ├── server.js        # Entry point
│   ├── package.json
│   └── .env            # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API calls
    │   ├── hooks/       # Custom hooks
    │   ├── context/     # State management
    │   ├── styles/      # CSS & TailwindCSS
    │   ├── utils/       # Validators & helpers
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env            # Environment variables
```

---

## Installation & Setup

### Prerequisites
- Node.js v16+ 
- npm or yarn
- MySQL 8+ (local/XAMPP or hosted)

### Backend Setup

```bash
cd backend
npm install
```

**Configure environment variables** (`.env`):
```env
PORT=5000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ai_career_launchpad
DEV_BYPASS_AUTH=true
DEV_LOGIN_EMAIL=dev@localhost.com
DEV_LOGIN_PASSWORD=devpassword
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh_secret_min_32_chars_change_in_production
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@aicareerlaunchpad.com
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Start backend**:
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

**Configure environment variables** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Career Launchpad
```

**Start frontend**:
```bash
npm run dev
```
App runs on `http://localhost:5173`

---

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Create App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password
4. Set `EMAIL_USER=your_email@gmail.com` and `EMAIL_PASSWORD=app_password_here` in `.env`

---

## MongoDB Setup

### Option 1: Local MongoDB
```bash
# Windows (if installed)
mongod
```

### Option 2: MongoDB Atlas (Cloud - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
5. Set `MONGODB_URI` in backend `.env`

---

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email OTP
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/verify-security-question` - Verify security question
- `POST /api/auth/verify-security-pin` - Verify PIN
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete account

### Resume
- `GET /api/resume` - Get resume
- `POST /api/resume` - Create resume
- `PUT /api/resume/:id` - Update resume

### Skills
- `GET /api/skills/gap-analysis` - Get skill gap analysis
- `POST /api/skills/gap-analysis` - Create gap analysis

### Jobs
- `GET /api/jobs/search` - Search jobs
- `GET /api/jobs/saved` - Get saved jobs
- `POST /api/jobs/save/:jobId` - Save job

### Interviews
- `GET /api/interviews/questions` - Get interview questions
- `POST /api/interviews/start` - Start interview
- `POST /api/interviews/submit` - Submit interview

---

## Development Workflow

### Phase 1: Foundation (Week 1)
- ✅ Authentication system with 3-factor auth
- ✅ Basic profile management
- ✅ Database setup
- ✅ API structure

### Phase 2: Core Features (Week 2-3)
- Resume builder with sections
- Skill gap analyzer
- Job finder integration
- Mock interview module

### Phase 3: Advanced Features (Week 4)
- AI chatbot integration
- Dashboard analytics
- Performance optimization
- Testing & deployment

---

## Performance Optimization Tips

### Backend
- Use database indexing on frequently queried fields
- Implement pagination for large datasets
- Add response caching with Redis
- Use compression middleware
- Rate limit to prevent abuse
- Use select() to fetch only needed fields

### Frontend
- Code splitting with React.lazy()
- Image lazy loading
- Memoization for expensive components
- Debounce search inputs
- Minimize bundle size (use lightweight alternatives)

---

## Production Deployment

### Backend Deployment
- **Railway**: https://railway.app/
- **Render**: https://render.com/
- **Heroku**: https://www.heroku.com/

### Frontend Deployment
- **Vercel**: https://vercel.com/
- **Netlify**: https://www.netlify.com/

### Database
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas (free tier)

---

## Environment Files Checklist

- ✅ Backend `.env` configured
- ✅ Frontend `.env` configured
- ✅ MongoDB connection verified
- ✅ Email service configured
- ✅ JWT secrets set (change in production)

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
→ Start MongoDB service or use MongoDB Atlas cloud

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
→ Check `FRONTEND_URL` in backend `.env` matches your frontend URL

### Email Not Sending
```
Error: Invalid login: 534
```
→ Use Gmail App Password, not regular password

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
→ Change PORT in `.env` or kill process using that port

---

## Best Practices Applied

✅ Security: Helmet, CORS, rate limiting, password hashing  
✅ Error Handling: Centralized error middleware  
✅ Validation: Input validation on both frontend & backend  
✅ Performance: Compression, pagination, lazy loading  
✅ Code Organization: Modular folder structure  
✅ Environment: Separate configs for dev/prod  
✅ Authentication: JWT + 3-factor verification  
✅ Documentation: This comprehensive README  

---

## Future Enhancements

- [ ] Real-time notifications
- [ ] Video interview recorder
- [ ] Resume scoring with AI
- [ ] Skill recommendations from job market
- [ ] LinkedIn integration
- [ ] GitHub profile analysis
- [ ] Payment gateway for premium features
- [ ] Admin dashboard
- [ ] Mobile app (React Native)
- [ ] WebSocket for live collaboration

---

## License

MIT License - Feel free to use for university projects

---

## Support

For issues or questions, create a GitHub issue or contact the development team.

---

**Ready to launch your career? Start building! 🚀**
