const request = require('supertest');
const baseURL = process.env.SERVER_URL || 'http://localhost:3000';
let adminToken, userId;

describe('Users Suite', () => {
  beforeAll(async () => {
    // Register admin and a user
    await request(baseURL).post('/api/auth/register').send({ name: 'AdminU', email: 'adminu@example.com', password: 'adminpass', phone: '0715555555', address: 'Bucuresti', role: 'admin' });
    const adminLogin = await request(baseURL).post('/api/auth/login').send({ email: 'adminu@example.com', password: 'adminpass' });
    adminToken = adminLogin.body.token;
    const userRes = await request(baseURL).post('/api/auth/register').send({ name: 'UserTest', email: 'usertest@example.com', password: 'testpass', phone: '0766666666', address: 'Bucuresti' });
    userId = userRes.body.user.id;
  });

  test('TC17 - Re-inregistrare dupa stergere', async () => {
    await request(baseURL).delete(`/api/auth/${userId}`).set('Authorization', `Bearer ${adminToken}`);
    const res = await request(baseURL).post('/api/auth/register').send({ name: 'UserTest', email: 'usertest@example.com', password: 'testpass', phone: '0766666666', address: 'Bucuresti' });
    expect(res.statusCode).toBe(201);
  });

  test('Acces GET /users fara token', async () => {
    const res = await request(baseURL).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  test('GET /users cu token client ar trebui forbidden', async () => {
    const clientLogin = await request(baseURL).post('/api/auth/login').send({ email: 'usertest@example.com', password: 'testpass' });
    const clientToken = clientLogin.body.token;
    const res = await request(baseURL).get('/api/users').set('Authorization', `Bearer ${clientToken}`);
    expect(res.statusCode).toBe(403);
  });
});
