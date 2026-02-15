import request from 'supertest';
import app from '../src/server.js';
import Post from '../src/models/Post.js';
import User from '../src/models/User.js';

const api = request(app);

let token;
let userId;

beforeEach(async () => {
  const res = await api.post('/api/auth/register').send({ username: 'postuser', email: 'post@yomi.com', password: 'password123' });
  token = res.body.data.token;
  userId = res.body.data.user._id;
});

describe('Post Endpoints', () => {
  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      const res = await api.get('/api/posts');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should support pagination', async () => {
      const res = await api.get('/api/posts?page=1&limit=5');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('currentPage');
      expect(res.body).toHaveProperty('totalPages');
    });

    it('should support sorting', async () => {
      const res = await api.get('/api/posts?sort=-createdAt');
      
      expect(res.status).toBe(200);
    });

    it('should support tag filtering', async () => {
      const res = await api.get('/api/posts?tag=javascript');
      
      expect(res.status).toBe(200);
    });

    it('should support search', async () => {
      const res = await api.get('/api/posts?q=test');
      
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a post (authenticated)', async () => {
      const res = await api.post('/api/posts').set('Authorization', `Bearer ${token}`).send({ title: 'Test Post', content: 'Test content', tags: ['test'] });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Post');
    });

    it('should return 401 for unauthenticated', async () => {
      const res = await api.post('/api/posts').send({ title: 'Test Post', content: 'Test content' });
      
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const res = await api.post('/api/posts').set('Authorization', `Bearer ${token}`).send({ title: 'Original', content: 'Original content' });
      postId = res.body._id;
    });

    it('should update own post', async () => {
      const res = await api.put(`/api/posts/${postId}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated' });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });

    it('should return 403 for another user post', async () => {
      const other = await api.post('/api/auth/register').send({ username: 'other', email: 'other@yomi.com', password: 'pass123' });
      const otherToken = other.body.data.token;

      const res = await api.put(`/api/posts/${postId}`).set('Authorization', `Bearer ${otherToken}`).send({ title: 'Hacked' });
      
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const res = await api.post('/api/posts').set('Authorization', `Bearer ${token}`).send({ title: 'To Delete', content: 'Content' });
      postId = res.body._id;
    });

    it('should delete own post', async () => {
      const res = await api.delete(`/api/posts/${postId}`).set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
    });

    it('should return 403 for another user post', async () => {
      const other = await api.post('/api/auth/register').send({ username: 'other2', email: 'other2@yomi.com', password: 'pass123' });
      const otherToken = other.body.data.token;

      const res = await api.delete(`/api/posts/${postId}`).set('Authorization', `Bearer ${otherToken}`);
      
      expect(res.status).toBe(403);
    });
  });
});
