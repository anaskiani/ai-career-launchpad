@echo off
echo Starting AI Career Launchpad...
echo.
echo Backend setup...
cd backend
npm install
echo.
echo Frontend setup...
cd ../frontend
npm install
echo.
echo Setup complete! Run 'npm run dev' in each folder to start.
pause
