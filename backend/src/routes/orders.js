const router = require("express").Router();
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const auth = require("../middleware/auth");

// GET all orders (admin)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "courier") return res.status(403).json({ msg: "Forbidden" });
  res.json(await Order.getAll());
});

// GET orders for a user
router.get("/user/:userId", auth, async (req, res) => {
  const orders = await Order.getByUser(req.params.userId);
  for (let o of orders) {
    o.items = await OrderItem.getByOrder(o.OrderId);
  }
  res.json(orders);
});

// POST create order
router.post("/", auth, async (req, res) => {
  const { deliveryAddress, items } = req.body;
  const orderId = await Order.create({ userId: req.user.id, deliveryAddress, items });
  res.status(201).json({ orderId });
});

// PUT update status
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  await Order.updateStatus(req.params.id, status);
  res.json({ msg: "Status updated" });
});

// DELETE order
router.delete("/:id", auth, async (req, res) => {
  await Order.delete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
