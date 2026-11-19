const mysql = require("mysql2/promise");

// ------------------------------------------------------------
// SSL config
//   DB_SSL="true"          -> SSL on (Aiven jaise cloud MySQL ke liye, jo SSL REQUIRED maangte hain)
//   DB_SSL="false"/missing -> SSL bilkul nahi (local MySQL)
//
// rejectUnauthorized: true = server ka certificate verify hoga (fake server se connect na ho).
//
// DB_SSL_CA (optional): Aiven console se download ki hui ca.pem ka content.
// Aiven ka CA Node ki default trusted list me nahi hota, isliye iske baghair
// "self-signed certificate in certificate chain" error aa sakta hai.
// .env me ek line me likhne ke liye newlines ki jagah \n likh sakte ho.
// ------------------------------------------------------------
function buildSslConfig() {
  if (process.env.DB_SSL !== "true") return undefined;

  const ssl = { rejectUnauthorized: true };
  if (process.env.DB_SSL_CA) {
    ssl.ca = process.env.DB_SSL_CA.replace(/\\n/g, "\n");
  }
  return ssl;
}

const sslConfig = buildSslConfig();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // SSL sirf tab jab DB_SSL="true" ho; warna ye key config me aati hi nahi
  ...(sslConfig && { ssl: sslConfig }),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query("SELECT 1");
  } finally {
    connection.release();
  }
}

module.exports = { pool, testConnection };
