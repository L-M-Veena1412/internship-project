const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

// Auto-enable SSL when using a connection URL (Railway public endpoint requires it).
// rejectUnauthorized defaults to false for URL-based connections (Railway uses self-signed certs).
const sslEnabled = connectionUrl ? true : process.env.DB_SSL === 'true';
const rejectUnauthorized = connectionUrl
  ? process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'   // default false for Railway
  : process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';  // default true for manual config

const commonPoolConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslEnabled ? { ssl: { rejectUnauthorized } } : {}),
};

let poolConfig;

if (connectionUrl) {
  const parsed = new URL(connectionUrl);
  poolConfig = {
    ...commonPoolConfig,
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
  };
} else {
  poolConfig = {
    ...commonPoolConfig,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

const pool = mysql.createPool(poolConfig);

// Test the connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully');
    conn.release();
  })
  .catch(err => {
    // Log full error so platform logs show the actual cause
    console.error('❌ MySQL connection failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    process.exit(1);
  });

module.exports = pool;
