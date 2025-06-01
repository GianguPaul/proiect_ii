// File: auto_test_project/mockServer.js

import express from 'express';
import bodyParser from 'body-parser';

// Middleware simplu de „autentificare” care verifică header-ul Authorization
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ error: 'Token missing' });
  }
  // Dacă există, simulăm extracția rolului dintr-un JWT: vom presupune că token-ul
  // conține literal «Bearer admin» sau «Bearer client»
  const parts = header.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Invalid token format' });
  }
  const token = parts[1];
  // Simplu: dacă token exact e 'admin' => rol admin, altfel client
  req.user = { role: token === 'admin' ? 'admin' : 'client', id: 1 };
  next();
}

const app = express();
app.use(bodyParser.json());

// În memorie păstrăm un „user” și „product” pentru a returna id-urile
let nextUserId = 1;
let nextProductId = 1;
let nextOrderId = 1;
let users = [];      // { id, name, email, password, role, phone, address }
let products = [];   // { id, name, description, price, category, isAvailable, imageUrl, stock }
let orders = [];     // { id, userId, items, total, status }

// ----------------------
// 1) Auth endpoints
// ----------------------

// POST /api/auth/register
// Așteaptă body: { name, email, password, phone, address, [role] }
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  // Simulăm duplicate pe email
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  const newUser = {
    id: nextUserId++,
    name,
    email,
    password,
    phone,
    address,
    role: role || 'client'
  };
  users.push(newUser);
  // Răspund exact cum cer testele:
  return res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      email: newUser.email
    }
  });
});

// POST /api/auth/login
// Așteaptă body: { email, password }
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Returnăm un „token” simplu (în realitate ar fi un JWT)
//  const token = jwt.sign({ id: found.id, role: found.role }, 'SECRET');
  // În testele noastre așteptăm zic: res.body.token și res.body.user
  const token = found.role; 
  return res.status(200).json({
    token,
    user: {
      id: found.id,
      name: found.name,
      role: found.role,
      phone: found.phone,
      address: found.address,
      email: found.email
    }
  });
});

// DELETE /api/auth/:userId  → folosit în testul de re-inregistrare după ștergere
app.delete('/api/auth/:userId', authMiddleware, (req, res) => {
  const uid = parseInt(req.params.userId, 10);
  const idx = users.findIndex(u => u.id === uid);
  if (idx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(idx, 1);
  return res.status(204).end();
});

// ----------------------
// 2) Products endpoints
// ----------------------

// GET /api/products
// Protejat de middleware: dacă lipsește token => 401
app.get('/api/products', authMiddleware, (req, res) => {
  return res.status(200).json(products);
});

// POST /api/products  → crează produs; doar rol admin
app.post('/api/products', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { name, description, price, category, isAvailable, imageUrl } = req.body;
  const newProduct = {
    id: nextProductId++,
    name, description, price, category,
    isAvailable: !!isAvailable,
    imageUrl: imageUrl || '',
    stock: 100 // stoc inițial
  };
  products.push(newProduct);
  return res.status(201).json(newProduct);
});

// PUT /api/products/:id  → update produs; doar rol admin
app.put('/api/products/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const pid = parseInt(req.params.id, 10);
  const p = products.find(x => x.id === pid);
  if (!p) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const { price, isAvailable } = req.body;
  if (price !== undefined) p.price = price;
  if (isAvailable !== undefined) p.isAvailable = isAvailable;
  return res.status(200).json(p);
});

// DELETE /api/products/:id  → șterge produs; doar rol admin
app.delete('/api/products/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const pid = parseInt(req.params.id, 10);
  const idx = products.findIndex(x => x.id === pid);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(idx, 1);
  return res.status(204).end();
});

// ----------------------
// 3) Orders endpoints
// ----------------------

// POST /api/orders  → creare comandă; rol client
app.post('/api/orders', authMiddleware, (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const { userId, items, total } = req.body;
  // Verificăm că userId există
  if (!users.find(u => u.id === userId)) {
    return res.status(400).json({ error: 'Invalid user' });
  }
  // Verificăm stocul pentru primul item (testele noastre verifică doar TC12)
  const firstItem = items[0];
  const prod = products.find(p => p.id === firstItem.productId);
  if (!prod) {
    return res.status(400).json({ error: 'Invalid product' });
  }
  if (firstItem.quantity > prod.stock) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }
  // Dăm „n” la produs și creăm comanda
  prod.stock -= firstItem.quantity;
  const newOrder = {
    id: nextOrderId++,
    userId,
    items,
    total,
    status: 'pending'
  };
  orders.push(newOrder);
  return res.status(201).json({ id: newOrder.id, ...newOrder });
});

// GET /api/orders/:orderId  → vizualizare comandă; oricine cu token
app.get('/api/orders/:orderId', authMiddleware, (req, res) => {
  const oid = parseInt(req.params.orderId, 10);
  const o = orders.find(x => x.id === oid);
  if (!o) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.status(200).json(o);
});

// PATCH /api/orders/:orderId/status  → doar admin poate schimba status
app.patch('/api/orders/:orderId/status', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const oid = parseInt(req.params.orderId, 10);
  const o = orders.find(x => x.id === oid);
  if (!o) {
    return res.status(404).json({ error: 'Order not found' });
  }
  o.status = req.body.status || o.status;
  return res.status(200).json(o);
});

// DELETE /api/orders/:orderId  → doar admin poate șterge
app.delete('/api/orders/:orderId', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const oid = parseInt(req.params.orderId, 10);
  const idx = orders.findIndex(x => x.id === oid);
  if (idx === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  orders.splice(idx, 1);
  return res.status(204).end();
});

// ----------------------
// 4) Users endpoints (suport pentru testul TC17 și accesarea listei de utilizatori)
// ----------------------

// GET /api/users  → doar admin poate vedea lista de utilizatori
app.get('/api/users', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  // Răspundem cu array de utilizatori (fără parola)
  const safeLista = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    address: u.address
  }));
  return res.status(200).json(safeLista);
});

// (Nu implementăm aici  DELETE /api/users/:id pentru că testul TC17 folosește DELETE /api/auth/:userId)

// ----------------------
// Pornim serverul
// ----------------------

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`📦 [mockServer] ascultă pe http://localhost:${PORT}`);
});
