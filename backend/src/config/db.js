// src/config/db.js
require('dotenv').config();
const sql = require('mssql');

async function connect() {
  const config = process.env.DB_CONNECTION_STRING
    ? process.env.DB_CONNECTION_STRING
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        server: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        database: process.env.DB_NAME,
        options: {
          encrypt: process.env.DB_ENCRYPT === 'true',
          trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
        }
      };

  console.log('🔌 Conectare MSSQL cu config:', config);
  return sql.connect(config);
}

module.exports = { connect, sql };
