import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  const uri = 'mysql://JYx5kN7G8aSCcPZ.root:5pgbHu47QMMHELoC@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}';
  console.log('Connecting to TiDB...');
  const connection = await mysql.createConnection({ uri, multipleStatements: true });
  
  try {
    const initPath = path.join(__dirname, 'db', 'init.sql');
    const sql = await fs.readFile(initPath, 'utf8');
    
    const statements = sql
      .split(';')
      .map((statement) => statement.trim())
      .filter(Boolean);
      
    console.log(`Running ${statements.length} SQL statements...`);
    for (let i = 0; i < statements.length; i++) {
      await connection.query(statements[i]);
      if (i % 10 === 0) console.log(`Progress: ${i}/${statements.length}`);
    }
    
    // Also run the generated real quiz file if needed.
    const mcqPath = path.join(__dirname, 'data', 'interviewQuestions.js');
    console.log('TiDB completely initialized!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

init();
