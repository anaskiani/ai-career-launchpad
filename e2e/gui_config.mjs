export const BASE_URL = (process.env.GUI_BASE_URL || 'http://localhost:5173').replace(/\/$/, '');
/** App URL reachable from browsers inside Docker Grid nodes (Windows/Mac). */
export const GRID_APP_URL = (process.env.GUI_GRID_BASE_URL || 'http://host.docker.internal:5173').replace(/\/$/, '');
export const GRID_HUB_URL = (process.env.SELENIUM_GRID_URL || 'http://localhost:4444/wd/hub').replace(/\/$/, '');
export const DEV_EMAIL = process.env.DEV_LOGIN_EMAIL || 'dev@localhost.com';
export const DEV_PASSWORD = process.env.DEV_LOGIN_PASSWORD || 'devpassword';
export const HEADLESS = process.env.GUI_HEADLESS === '1';
export const EXPLICIT_WAIT_MS = Number(process.env.GUI_EXPLICIT_WAIT || 20000);
