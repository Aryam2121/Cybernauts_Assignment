import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/User';

// Mock data
const mockUser = {
  username: 'testuser',
  age: 25,
  hobbies: ['reading', 'gaming']
};

const mockUser2 = {
  username: 'testuser2',
  age: 30,
  hobbies: ['reading', 'cooking', 'gaming']
};

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user-network-test');
});

afterEach(async () => {
  // Clear database after each test
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API Tests', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(mockUser)
        .expect(201);
      
      expect(res.body).toHaveProperty('id');
      expect(res.body.username).toBe(mockUser.username);
      expect(res.body.age).toBe(mockUser.age);
      expect(res.body.hobbies).toEqual(mockUser.hobbies);
      expect(res.body.popularityScore).toBe(0);
    });
    
    it('should fail with invalid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'a', age: 200 })
        .expect(400);
      
      expect(res.body).toHaveProperty('errors');
    });
  });
  
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      await request(app).post('/api/users').send(mockUser);
      await request(app).post('/api/users').send(mockUser2);
      
      const res = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(res.body).toHaveLength(2);
    });
  });
  
  describe('Friendship Tests', () => {
    it('should create a friendship between two users', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      const res = await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id })
        .expect(200);
      
      expect(res.body.user.friends).toContain(user2Res.body.id);
      expect(res.body.friend.friends).toContain(user1Res.body.id);
    });
    
    it('should prevent duplicate friendships', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      const res = await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id })
        .expect(409);
      
      expect(res.body.error).toBe('Users are already friends');
    });
    
    it('should remove friendship correctly', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      const res = await request(app)
        .delete(`/api/users/${user1Res.body.id}/unlink`)
        .send({ friendId: user2Res.body.id })
        .expect(200);
      
      expect(res.body.user.friends).not.toContain(user2Res.body.id);
      expect(res.body.friend.friends).not.toContain(user1Res.body.id);
    });
  });
  
  describe('Popularity Score Tests', () => {
    it('should calculate popularity score correctly', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      const updatedUser1 = await request(app).get(`/api/users/${user1Res.body.id}`);
      
      // Both users share 'reading' and 'gaming' = 2 shared hobbies
      // Formula: 1 friend + (2 shared hobbies × 0.5) = 1 + 1 = 2
      expect(updatedUser1.body.popularityScore).toBe(2);
    });
    
    it('should update popularity score when hobbies change', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      // Add more hobbies to user1
      const updatedUser = await request(app)
        .put(`/api/users/${user1Res.body.id}`)
        .send({ hobbies: ['reading', 'gaming', 'cooking'] });
      
      // Now shares 3 hobbies: reading, gaming, cooking
      // Formula: 1 friend + (3 × 0.5) = 2.5
      expect(updatedUser.body.popularityScore).toBe(2.5);
    });
  });
  
  describe('Deletion Tests', () => {
    it('should prevent deletion of user with friends', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      const res = await request(app)
        .delete(`/api/users/${user1Res.body.id}`)
        .expect(409);
      
      expect(res.body.error).toContain('Cannot delete user with active friendships');
    });
    
    it('should allow deletion after unlinking all friends', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      await request(app)
        .delete(`/api/users/${user1Res.body.id}/unlink`)
        .send({ friendId: user2Res.body.id });
      
      await request(app)
        .delete(`/api/users/${user1Res.body.id}`)
        .expect(200);
    });
  });
  
  describe('Graph Data Tests', () => {
    it('should return graph data with nodes and edges', async () => {
      const user1Res = await request(app).post('/api/users').send(mockUser);
      const user2Res = await request(app).post('/api/users').send(mockUser2);
      
      await request(app)
        .post(`/api/users/${user1Res.body.id}/link`)
        .send({ friendId: user2Res.body.id });
      
      const res = await request(app)
        .get('/api/graph')
        .expect(200);
      
      expect(res.body.nodes).toHaveLength(2);
      expect(res.body.edges).toHaveLength(1);
      expect(res.body.edges[0].source).toBe(user1Res.body.id);
      expect(res.body.edges[0].target).toBe(user2Res.body.id);
    });
  });
});
