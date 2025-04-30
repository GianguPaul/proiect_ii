const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// GET all users (admin)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  res.json(await User.getAll());
});

// GET user by id
router.get("/:id", auth, async (req, res) => {
  const u = await User.getById(req.params.id);
  res.json(u);
});

// UPDATE user (admin)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  await User.update(req.params.id, req.body);
  res.json({ msg: "Updated" });
});

// DELETE user (admin)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Forbidden" });
  await User.delete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
