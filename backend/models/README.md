# Legacy Mongoose models (not used)

The application runtime uses **MySQL** (`backend/db/init.sql` + `backend/config/mysql.js`).

Files in this folder are **leftover MERN scaffolding** and are not imported by `server.js` or any active route. Safe to ignore for development and demos.

Active data access lives in `backend/controllers/` via `getPool()` from `backend/config/mysql.js`.
