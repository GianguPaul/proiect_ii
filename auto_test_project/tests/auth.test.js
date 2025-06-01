const request = require('supertest');
const baseURL = process.env.SERVER_URL || 'http://localhost:3000';

describe('Auth Suite', () => {
  const email = 'test@example.com';
  const password = 'password123';

  test('TC01 - Inregistrare valid user', async () => {
    const res = await request(baseURL)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password, phone: '0712345678', address: 'Bucuresti' });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(email);
  });

  test('TC02 - Inregistrare email duplicat', async () => {
    const res = await request(baseURL)
      .post('/api/auth/register')
      .send({ name: 'Test User', email, password, phone: '0712345678', address: 'Bucuresti' });
    expect(res.statusCode).toBe(400);
  });

  test('TC03 - Autentificare cu credente corecte', async () => {
    const res = await request(baseURL)
      .post('/api/auth/login')
      .send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('TC04 - Autentificare parola incorecta', async () => {
    const res = await request(baseURL)
      .post('/api/auth/login')
      .send({ email, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  test('TC05 - Acces ruta protejata fara token', async () => {
    const res = await request(baseURL).get('/api/products');
    expect(res.statusCode).toBe(401);
  });
});
