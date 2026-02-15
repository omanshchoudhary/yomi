import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import User from '../src/models/User.js';

const api = request(app);

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@yomi.com', password: 'password123' });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.username).toBe('testuser');
    });

    it('should return 409 for duplicate email', async () => {
      await api.post('/api/auth/register').send({ username: 'user1', email: 'dup@yomi.com', password: 'password123' });
      const res = await api.post('/api/auth/register').send({ username: 'user2', email: 'dup@yomi.com', password: 'password123' });
      
      expect(res.status).toBe(409);
    });

    it('should return 400 for missing fields', async () => {
      const res = await api.post('/api/auth/register').send({ username: 'test' });
      
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await api.post('/api/auth/register').send({ username: 'loginuser', email: 'login@yomi.com', password: 'password123' });
    });

    it('should login with correct credentials', async () => {
      const res = await api.post('/api/auth/login').send({ email: 'login@yomi.com', password: 'password123' });
      
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should return 401 for wrong password', async () => {
      const res = await api.post('/api/auth/login').send({ email: 'login@yomi.com', password: 'wrongpass' });
      
      expect(res.status).toBe(401);
    });
  });
});
