const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// GET all products
router.get("/", async (req, res) => {
  res.json(await Product.getAll());
});

// GET by id
router.get("/:id", async (req, res) => {
  res.json(await Product.getById(req.params.id));
});

// Protected below (admin)
router.use(auth);
router.post("/", async (req, res) => {
  await Product.create(req.body);
  res.status(201).json({ msg: "Created" });
});
router.put("/:id", async (req, res) => {
  await Product.update(req.params.id, req.body);
  res.json({ msg: "Updated" });
});
router.delete("/:id", async (req, res) => {
  await Product.delete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
