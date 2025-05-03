// server.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');       // opțional, dar recomandat
const { connect } = require('./config/db');

// importă-ți toate rutele
const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');
const authMiddleware= require('./middleware/auth');

const app = express();
const API = '/api';

// 1) Securitate + CORS
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
// opțional: răspunde automat la toate preflight OPTIONS
app.options('*', cors());

// 2) Parsare JSON
app.use(express.json());

// 3) Conectare la DB
connect()
  .then(() => console.log('✅ Conectat la MSSQL'))
  .catch(err => console.error('❌ Eroare DB:', err.message));

// 4) Rute
//   rute publice
app.use(`${API}/auth`, authRoutes);

//   JWT middleware (protejează tot ce e după)
app.use(API, authMiddleware);

//   rute protejate
app.use(`${API}/users`,    userRoutes);
app.use(`${API}/products`, productRoutes);
app.use(`${API}/orders`,   orderRoutes);

// 5) Handler global de erori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// 6) Pornire server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server pornit pe http://localhost:${PORT}`)
);
