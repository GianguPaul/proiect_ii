require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const { connect } = require('./config/db');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');

const app = express();
const API = '/api';

// 1) Security & CORS
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors());

// 2) JSON body parsing
app.use(express.json());

// 3) Debug logger
app.use((req, res, next) => {
  console.log(`⬅️  ${req.method} ${req.originalUrl}`);
  next();
});

// 4) Health check
app.get('/ping', (req, res) => res.send('pong'));

// 5) Connect to DB
connect()
  .then(() => console.log('✅ Conectat la MSSQL'))
  .catch(err => console.error('❌ Eroare DB:', err.message));

// 6) Mount public auth routes
app.use(`${API}/auth`, authRoutes);

// 7) Mount all other routes (now public as well)
app.use(`${API}/users`,    userRoutes);
app.use(`${API}/products`, productRoutes);
app.use(`${API}/orders`,   orderRoutes);

// 8) Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// 9) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server pornit pe http://localhost:${PORT}`)
);
