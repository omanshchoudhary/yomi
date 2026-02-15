import request from 'supertest';
import app from '../src/server.js';

const api = request(app);

describe('Auth Middleware', () => {
  it('should pass with valid token', async () => {
    const register = await api.post('/api/auth/register').send({ username: 'valid', email: 'valid@yomi.com', password: 'pass123' });
    const token = register.body.data.token;

    const res = await api.post('/api/posts').set('Authorization', `Bearer ${token}`).send({ title: 'Test', content: 'Test' });
    
    expect(res.status).toBe(201);
  });

  it('should return 401 without token', async () => {
    const res = await api.post('/api/posts').send({ title: 'Test', content: 'Test' });
    
    expect(res.status).toBe(401);
  });

  it('should return 401 with invalid token', async () => {
    const res = await api.post('/api/posts').set('Authorization', 'Bearer invalidtoken').send({ title: 'Test', content: 'Test' });
    
    expect(res.status).toBe(401);
  });

  it('should return 401 with malformed header', async () => {
    const res = await api.post('/api/posts').set('Authorization', 'InvalidFormat').send({ title: 'Test', content: 'Test' });
    
    expect(res.status).toBe(401);
  });
});
