// backend/src/routes/products.js

const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// 1) GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2) GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const prod = await Product.getById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Produs inexistent' });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3) POST /api/products
router.post('/', async (req, res) => {
  try {
    await Product.create(req.body);
    res.status(201).json({ msg: 'Produs creat!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4) PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.params.id, req.body);
    res.json({ msg: 'Produs actualizat!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5) DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await Product.delete(req.params.id);
    res.json({ msg: 'Produs șters!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
