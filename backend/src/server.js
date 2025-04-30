  require("dotenv").config();
  const express = require("express");
  const { connect } = require("./config/db");

  const authRoutes      = require("./routes/auth");
  const authMiddleware  = require("./middleware/auth");
  const userRoutes      = require("./routes/users");
  const productRoutes   = require("./routes/products");
  const orderRoutes     = require("./routes/orders");

  const app = express();
  app.use(express.json());

  connect()
    .then(() => console.log("✅ Conectat la MSSQL"))
    .catch(err => console.error(err));

  // 1) Rutele publice de autentificare
  app.use("/routes/auth", authRoutes);

  // 2) Apoi, protejăm restul cu JWT
  app.use("/routes/users",    authMiddleware, userRoutes);
  app.use("/routes/products", authMiddleware, productRoutes);
  app.use("/routes/orders",   authMiddleware, orderRoutes);

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server pornit pe http://localhost:${PORT}`));
