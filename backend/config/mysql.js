import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

const defaults = {
  DB_HOST: '127.0.0.1',
  DB_PORT: 3306,
  DB_USER: 'root',
  DB_PASSWORD: '',
  DB_NAME: 'ai_career_launchpad',
};

const dbConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    }
  : {
      host: process.env.DB_HOST || defaults.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || defaults.DB_PORT, 10),
      user: process.env.DB_USER || defaults.DB_USER,
      password: process.env.DB_PASSWORD ?? defaults.DB_PASSWORD,
      database: process.env.DB_NAME || defaults.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
    };

let pool;

export const getPool = () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }

  return pool;
};

const toSingleLineStatements = (sqlText) =>
  sqlText
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);

export const initializeDatabase = async () => {
  const bootstrapConnection = process.env.DATABASE_URL
    ? await mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true })
    : await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        multipleStatements: true,
      });

  try {
    if (!process.env.DATABASE_URL) {
      await bootstrapConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
      await bootstrapConnection.query(`USE \`${dbConfig.database}\``);
    }

    const initPath = path.join(process.cwd(), 'db', 'init.sql');
    const sql = await fs.readFile(initPath, 'utf8');
    const statements = toSingleLineStatements(sql);

    for (const statement of statements) {
      await bootstrapConnection.query(statement);
    }

    getPool();
    console.log(`✓ MySQL ready (${dbConfig.database})`);
  } finally {
    await bootstrapConnection.end();
  }
};
