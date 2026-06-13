import { initializeDatabase } from './mysql.js';

export const connectDB = async () => {
  await initializeDatabase();
};
