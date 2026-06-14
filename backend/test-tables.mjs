import mysql from 'mysql2/promise';

async function test() {
  const pool = mysql.createPool({ uri: 'mysql://JYx5kN7G8aSCcPZ.root:5pgbHu47QMMHELoC@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}' });
  try {
    await pool.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL');
    console.log("Added google_id column");
  } catch (e) {
    console.log("google_id column might already exist", e.message);
  }
  try {
    await pool.query('ALTER TABLE users ADD UNIQUE (google_id)');
    console.log("Added unique constraint to google_id");
  } catch (e) {
    console.log("Unique constraint might already exist", e.message);
  }
  try {
    await pool.query('ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL');
    console.log("Made password_hash column nullable");
  } catch (e) {
    console.log("Failed to modify password_hash column", e.message);
  }
  process.exit(0);
}

test();
