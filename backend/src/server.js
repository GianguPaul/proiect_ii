require("dotenv").config();
const express = require("express");
const { connect } = require("./config/db");

const authRoutes      = require("./routes/auth");
const authMiddleware  = require("./middleware/authMiddleware");
const userRoutes      = require("./routes/users");
const productRoutes   = require("./routes/products");
const orderRoutes     = require("./routes/orders");

const app = express();
app.use(express.json());

connect()
  .then(() => console.log("✅ Conectat la MSSQL"))
  .catch(err => console.error(err));

// 1) Rutele publice de autentificare
app.use("/api/auth", authRoutes);

// 2) Apoi, protejăm restul cu JWT
app.use("/api/users",    authMiddleware, userRoutes);
app.use("/api/products", authMiddleware, productRoutes);
app.use("/api/orders",   authMiddleware, orderRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server pornit pe http://localhost:${PORT}`));
