import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
// Create a MySQL connection pool
dotenv.config();
const pool = mysql.createPool({

  host: 'localhost',
  user: 'root',
  password: 'Oma@1234',
  database: 'deployment',
  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on('connection', (connection) => {
  console.log('Connected to MySQL');
});

pool.on('error', (error) => {
  console.error('MySQL Pool Error:', error);
});

export default pool;
