// backend/src/routes/orders.js

const express    = require("express");
const router     = express.Router();
const Order      = require("../models/Order");
const OrderItem  = require("../models/OrderItem");

// 1) GET /api/orders
//    → Listează toate comenzile
router.get("/", async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2) GET /api/orders/user/:userId
//    → Listează comenzile unui utilizator
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.getByUser(req.params.userId);
    // atașăm items pentru fiecare comandă
    for (let o of orders) {
      o.items = await OrderItem.getByOrder(o.OrderId);
    }
    res.json(orders);
  } catch (err) {
    console.error("GET ORDERS BY USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3) POST /api/orders
//    → Creează o comandă nouă
router.post("/", async (req, res) => {
  const { userId, deliveryAddress, items } = req.body;
  if (!userId || !items?.length) {
    return res.status(400).json({ error: "Lipă userId sau items" });
  }
  try {
    const orderId = await Order.create({ userId, deliveryAddress, items });
    res.status(201).json({ orderId });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4) PUT /api/orders/:id/status
//    → Actualizează status-ul unei comenzi
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    await Order.updateStatus(req.params.id, status);
    res.json({ msg: "Status updated" });
  } catch (err) {
    console.error("UPDATE ORDER STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5) DELETE /api/orders/:id
//    → Șterge o comandă
router.delete("/:id", async (req, res) => {
  try {
    await Order.delete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
