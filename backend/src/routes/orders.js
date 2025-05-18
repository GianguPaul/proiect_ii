// backend/src/routes/orders.js
const express   = require("express");
const router    = express.Router();
const Order     = require("../models/Order");
const OrderItem = require("../models/OrderItem");

// 1) GET /api/orders
router.get("/", async (req, res) => {
  console.log("[OrderRouter] → GET /api/orders");
  try {
    const orders = await Order.getAll();
    for (let o of orders) {
      o.items = await OrderItem.getByOrder(o.OrderId);
    }
    res.json(orders);
  } catch (err) {
    console.error("[OrderRouter] GET ALL ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2) GET /api/orders/user/:userId
router.get("/user/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  console.log(`[OrderRouter] → GET /api/orders/user/${userId}`);
  try {
    const orders = await Order.getByUser(userId);
    for (let o of orders) {
      o.items = await OrderItem.getByOrder(o.OrderId);
    }
    res.json(orders);
  } catch (err) {
    console.error("[OrderRouter] GET ORDERS BY USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3) POST /api/orders
router.post("/", async (req, res) => {
  const { userId, deliveryAddress, items } = req.body;
  console.log("[OrderRouter] → POST /api/orders", { userId, deliveryAddress, items });
  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Lipsește userId sau items" });
  }
  try {
    const orderId = await Order.create({ userId, deliveryAddress, items });
    console.log("[OrderRouter] → Created order", orderId);
    res.status(201).json({ orderId });
  } catch (err) {
    console.error("[OrderRouter] CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4) PUT /api/orders/:id/status
router.put("/:id/status", async (req, res) => {
  const id     = parseInt(req.params.id, 10);
  const status = req.body.status;
  console.log(`[OrderRouter] → PUT /api/orders/${id}/status`, status);
  if (!status) {
    return res.status(400).json({ error: "Lipsește câmpul `status`" });
  }
  try {
    await Order.updateStatus(id, status);
    console.log(`[OrderRouter] → Status for order ${id} updated to "${status}" in DB`);

    // Return the updated order
    const all    = await Order.getAll();
    const updated = all.find(o => o.OrderId === id);
    updated.items = await OrderItem.getByOrder(id);
    res.json(updated);
  } catch (err) {
    console.error("[OrderRouter] UPDATE ORDER STATUS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5) DELETE /api/orders/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log(`[OrderRouter] → DELETE /api/orders/${id}`);
  try {
    await Order.delete(id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error("[OrderRouter] DELETE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
