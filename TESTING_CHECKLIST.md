# AI Career Launchpad Testing Checklist

## Test Environment

- Automated smoke tests: `cd backend && npm run test` (9 checks, no paid APIs)
- Backend server runs on the configured `PORT`
- Frontend runs with the correct `VITE_API_URL`
- MySQL is running (XAMPP or local service) and `DB_*` vars in `backend/.env` are correct
- Test at least one flow with valid auth and one with invalid/expired auth
- Test both with external providers available and with fallback mode triggered

## 1. Auth Testing

### Registration
- Register with valid name, email, password, security question, and 4-digit PIN
- Register with an already used email
- Register with an invalid email format
- Register with a short password
- Register with missing required fields
- Verify OTP with a valid code
- Verify OTP with an invalid code
- Verify OTP after expiry

### Login
- Login with valid credentials
- Login with invalid email
- Login with invalid password
- Complete security question successfully
- Fail security question with wrong answer
- Complete security PIN successfully
- Fail security PIN with wrong PIN
- Confirm token is stored and protected routes open after login
- Confirm logout clears token/user state and redirects correctly
- Dev login (`dev@localhost.com` / `devpassword`) completes in one step when `DEV_BYPASS_AUTH=true`
- Forgot password request + reset with OTP (dev OTP in response if email fails)

## 2. Profile Testing

### Profile Load and Save
- Load profile after login
- Update basic profile fields successfully
- Save profile with empty optional fields
- Save profile with long bio text
- Save profile with multiple skills
- Save nested education/work experience entries

### Avatar
- Upload a valid image avatar
- Upload an invalid file type
- Upload an oversized image if size validation exists
- Replace an existing avatar
- Delete avatar successfully

### Validation and Security
- Access profile without auth token
- Confirm password/security fields are never returned in profile response

## 3. Resume Testing

### CRUD
- Load empty resume state for a new user
- Create first resume successfully
- Update existing resume successfully
- Delete resume successfully
- Try creating a second resume when one already exists

### Sections
- Add/edit/delete personal info
- Add/edit/delete experience entries
- Add/edit/delete education entries
- Add/edit/delete project entries
- Add/edit/delete certifications
- Add/edit/delete skills with different proficiency values

### Edge Cases
- Save with minimal data only
- Save with many entries in each section
- Refresh page and confirm saved resume reloads correctly

## 4. Skill Analyzer Testing

### Analysis Flow
- Load available target roles
- Analyze a valid target role
- Analyze with no target role selected
- Confirm match percentage, matching skills, and missing skills render correctly
- Confirm roadmap and recommendations are shown

### History
- View recent analysis history
- Load a historical analysis
- Delete a historical analysis
- Confirm dashboard reflects latest skill match summary

### Edge Cases
- Analyze when user profile has zero skills
- Analyze after updating profile skills

## 5. Job Finder Testing

### Search and Filters
- Search jobs with keyword only
- Search jobs with location only
- Search jobs with keyword + location
- Search with type filter = all
- Search with type filter = jobs
- Search with type filter = internships
- Search with no filters
- Search with a query that returns no results

### Job Cards and Details
- Open job details modal/page from search results
- Confirm company, location, salary, type, description, and skills render
- Open apply link in a new tab

### Save / Bookmark
- Save a job from the card list
- Save a job from the details modal
- Remove a saved job
- Confirm saved jobs state persists after refresh
- Confirm dashboard saved jobs count updates

### Pagination and Fallback
- Move to next page
- Move back to previous page
- Confirm page number updates correctly
- Simulate external API failure/rate limit and confirm fallback jobs display
- Confirm fallback banner/message is visible

## 6. Mock Interview Testing

### Session Start
- Load interview roles list
- Start interview for each available role
- Try to start without selecting a role

### Questions and Answers
- Confirm both technical and HR questions are generated
- Type answers for multiple questions
- Save answers mid-session
- Refresh/load saved session from history
- Resume editing an in-progress session

### Submission and History
- Submit completed session
- Confirm submitted session becomes read-only
- Confirm history shows in-progress and completed sessions
- Open old session from history
- Confirm dashboard interview stats update correctly

### Edge Cases
- Submit with some blank answers
- Save a very long answer
- Try to access another user’s interview session by ID

## 7. Chatbot Testing

### Chat Flow
- Send a resume-related prompt
- Send an interview-related prompt
- Send a skill roadmap prompt
- Send a job advice prompt
- Send a general career guidance prompt
- Confirm replies render and history persists

### Fallback / Provider Failure
- Run chatbot without external AI key configured
- Confirm fallback guidance is returned
- Confirm fallback notice is visible in UI
- Simulate provider failure and confirm graceful fallback

### History and Security
- Refresh page and confirm history reloads
- Confirm only current user’s messages are returned
- Confirm empty message cannot be submitted
- Confirm dashboard chatbot metrics update

## 8. Dashboard Testing

### Summary Cards
- Confirm profile completion shows real value
- Confirm resume status reflects actual resume existence
- Confirm saved jobs count reflects bookmarks
- Confirm skill gap card reflects latest analysis
- Confirm interview stats reflect real sessions
- Confirm chatbot activity reflects saved assistant replies

### Charts and Activity
- Confirm overview bar chart values match backend summary
- Confirm readiness chart values match profile/skill data
- Confirm recent interview activity list is correct
- Confirm recent chatbot activity list is correct

### Edge Cases
- Test dashboard for a brand new user with no data
- Test dashboard after creating data across all modules

## 9. API / Backend Edge Cases

- Missing auth token on every protected route
- Invalid/expired auth token on protected routes
- Invalid MongoDB connection string
- MySQL unavailable at startup
- Large payload handling for resume/interview answers
- External job API timeout
- External AI provider timeout
- Duplicate save job action
- Invalid route params (`jobId`, `interviewId`, analysis IDs)

## 10. Frontend UX / State Edge Cases

- Slow network loading states appear correctly
- Error states show clear messages
- Buttons disable while requests are in progress
- Browser refresh preserves auth session
- Modals close correctly
- Mobile responsiveness for dashboard, jobs, interview, and chatbot pages
- Navigation between modules works without stale state bugs

## Final QA Checklist

- Register -> login -> dashboard works end-to-end
- Profile updates affect skill analyzer and dashboard correctly
- Resume create/update/delete works end-to-end
- Job Finder works with provider and fallback mode
- Saved jobs count matches dashboard
- Mock interview start/save/submit/history works
- Submit interview shows per-question scores/feedback and overall session score (local scoring)
- Chatbot works with real provider or fallback mode
- Dashboard shows real aggregated data
- No frontend build errors
- No newly introduced linter errors
- API responses are reasonably fast on repeated use
- Protected routes reject unauthorized access
- App is usable after page refresh on all core modules

## Suggested Manual Test Scenarios

### Scenario A: New User Journey
1. Register a new user
2. Verify email and log in
3. Complete profile
4. Create resume
5. Run skill analysis
6. Search and save a job
7. Start and submit a mock interview
8. Ask the chatbot for job advice
9. Check dashboard values

### Scenario B: Returning User Journey
1. Log in with an existing user
2. Verify dashboard data loads correctly
3. Edit profile skills
4. Re-run skill analysis
5. Resume a saved mock interview
6. Continue chatbot conversation
7. Remove a saved job
8. Refresh and confirm all state remains correct

### Scenario C: Failure Handling
1. Stop external job provider access and confirm fallback jobs
2. Remove AI provider key and confirm chatbot fallback guidance
3. Use invalid token and confirm protected routes reject access
4. Submit invalid IDs to backend routes and confirm safe errors
