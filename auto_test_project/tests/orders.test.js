const request = require('supertest');
const baseURL = process.env.SERVER_URL || 'http://localhost:3000';
let clientToken;
let productId;
let userId;

describe('Orders Suite', () => {
  beforeAll(async () => {
    // Register client
    await request(baseURL).post('/api/auth/register').send({ name: 'Client', email: 'client@example.com', password: 'clientpass', phone: '0722222222', address: 'Bucuresti' });
    const loginRes = await request(baseURL).post('/api/auth/login').send({ email: 'client@example.com', password: 'clientpass' });
    clientToken = loginRes.body.token;
    userId = loginRes.body.user.id;

    // Register admin and create product
    await request(baseURL).post('/api/auth/register').send({ name: 'Admin2', email: 'admin2@example.com', password: 'adminpass', phone: '0714444444', address: 'Bucuresti', role: 'admin' });
    const adminLogin = await request(baseURL).post('/api/auth/login').send({ email: 'admin2@example.com', password: 'adminpass' });
    const adminToken = adminLogin.body.token;
    const prodRes = await request(baseURL).post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ProdusX', description: 'Desc', price: 5.0, category: 'Cat', isAvailable: true, imageUrl: '' });
    productId = prodRes.body.id;
  });

  test('TC11 - Creare comanda valida', async () => {
    const res = await request(baseURL)
      .post('/api/orders')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ userId, items: [{ productId, quantity: 2 }], total: 10.0 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('TC12 - Comanda cu stoc insuficient', async () => {
    const res = await request(baseURL)
      .post('/api/orders')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ userId, items: [{ productId, quantity: 999 }], total: 4995.0 });
    expect(res.statusCode).toBe(400);
  });

  test('TC13 - Vizualizare comanda dupa id', async () => {
    const orderRes = await request(baseURL)
      .post('/api/orders')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ userId, items: [{ productId, quantity: 1 }], total: 5.0 });
    const orderId = orderRes.body.id;

    const res = await request(baseURL)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('TC14 - Actualizare status comanda (admin)', async () => {
    const adminLogin = await request(baseURL).post('/api/auth/login').send({ email: 'admin2@example.com', password: 'adminpass' });
    const adminToken = adminLogin.body.token;
    const orderRes = await request(baseURL)
      .post('/api/orders')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ userId, items: [{ productId, quantity: 1 }], total: 5.0 });
    const orderId = orderRes.body.id;
    const res = await request(baseURL)
      .patch(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'shipped' });
    expect(res.statusCode).toBe(200);
  });

  test('TC15 - Stergere comanda (admin)', async () => {
    const adminLogin = await request(baseURL).post('/api/auth/login').send({ email: 'admin2@example.com', password: 'adminpass' });
    const adminToken = adminLogin.body.token;
    const orderRes = await request(baseURL)
      .post('/api/orders')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ userId, items: [{ productId, quantity: 1 }], total: 5.0 });
    const orderId = orderRes.body.id;
    const res = await request(baseURL)
      .delete(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);
  });
});
