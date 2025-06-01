const request = require('supertest');
const baseURL = process.env.SERVER_URL || 'http://localhost:3000';
let adminToken;
let createdProductId;

describe('Products Suite', () => {
  beforeAll(async () => {
    await request(baseURL).post('/api/auth/register').send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass', phone: '0711111111', address: 'Bucuresti', role: 'admin' });
    const login = await request(baseURL).post('/api/auth/login').send({ email: 'admin@example.com', password: 'adminpass' });
    adminToken = login.body.token;
  });

  test('TC06 - Vizualizare produse', async () => {
    const res = await request(baseURL)
      .get('/api/products')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('TC07 - Creare produs (admin)', async () => {
    const res = await request(baseURL)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Cafea', description: 'Cafea boabe', price: 10.5, category: 'Bauturi', isAvailable: true, imageUrl: '' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdProductId = res.body.id;
  });

  test('TC08 - Creare produs fara token', async () => {
    const res = await request(baseURL)
      .post('/api/products')
      .send({ name: 'Cafea', description: 'Cafea boabe', price: 10.5, category: 'Bauturi', isAvailable: true, imageUrl: '' });
    expect(res.statusCode).toBe(401);
  });

  test('TC09 - Actualizare produs (admin)', async () => {
    const res = await request(baseURL)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 12.0, isAvailable: false });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(12.0);
  });

  test('TC10 - Stergere produs (admin)', async () => {
    const res = await request(baseURL)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);
  });
});
