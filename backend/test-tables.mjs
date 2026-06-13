import mysql from 'mysql2/promise';

async function test() {
  const pool = mysql.createPool({ uri: 'mysql://JYx5kN7G8aSCcPZ.root:5pgbHu47QMMHELoC@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}' });
  const [rows] = await pool.query('SELECT email FROM users');
  console.log(rows);
  process.exit(0);
}
test();
