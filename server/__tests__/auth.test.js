// server/__tests__/auth.test.js
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../testApp.js'; // We'll create this next
import { setupTestDb, teardownTestDb, prisma } from '../src/db/testSetup.js';

describe('Auth Edge Case Testing', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    // Clean users before each test
    await prisma.user.deleteMany({});
  });

  // ==========================================
  // Test 1: Duplicate Registration
  // ==========================================
  describe('Duplicate Registration', () => {
    it('should reject duplicate email registration with 409 status', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // First registration should succeed
      const firstResponse = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(firstResponse.status).toBe(201);
      expect(firstResponse.body).toHaveProperty('token');
      expect(firstResponse.body).toHaveProperty('user');

      // Second registration with same email should fail
      const secondResponse = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body.message).toBe('Email already in use.');
    });

    it('should allow registration with different email', async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: 'user1@example.com', password: 'password123' });

      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'user2@example.com', password: 'password123' });

      expect(response.status).toBe(201);
    });
  });

  // ==========================================
  // Test 2: Wrong Credentials
  // ==========================================
  describe('Wrong Credentials', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/auth/register')
        .send({
          email: 'correct@example.com',
          password: 'correctPassword123'
        });
    });

    it('should reject login with wrong email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'correctPassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'correct@example.com',
          password: 'wrongPassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should reject login with missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'correctPassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required.');
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'correct@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required.');
    });
  });

  // ==========================================
  // Test 3: Missing Token
  // ==========================================
  describe('Missing Token', () => {
    it('should reject /auth/me request without Authorization header', async () => {
      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Missing or invalid Authorization header.');
    });

    it('should reject /auth/password request without Authorization header', async () => {
      const response = await request(app)
        .put('/auth/password')
        .send({
          currentPassword: 'oldPass',
          newPassword: 'newPass123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Missing or invalid Authorization header.');
    });
  });

  // ==========================================
  // Test 4: Invalid Token Format
  // ==========================================
  describe('Invalid Token Format', () => {
    it('should reject malformed token (no Bearer prefix)', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'InvalidTokenFormat');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Missing or invalid Authorization header.');
    });

    it('should reject completely invalid token string', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer not.a.valid.jwt');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token.');
    });

    it('should reject empty token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Missing or invalid Authorization header.');
    });

    it('should reject token with wrong signature', async () => {
      // Create a token signed with wrong secret
      const fakeToken = jwt.sign({ sub: 999 }, 'wrong_secret', { expiresIn: '1h' });

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${fakeToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token.');
    });
  });

  // ==========================================
  // Test 5: Expired Token
  // ==========================================
  describe('Expired Token', () => {
    it('should reject expired JWT token', async () => {
      const secret = process.env.JWT_SECRET;
      
      // Create an already-expired token (exp in the past)
      const expiredToken = jwt.sign(
        { sub: 1 },
        secret,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token.');
    });

    it('should reject token that expires in 1 second (edge case)', async () => {
      const secret = process.env.JWT_SECRET;
      
      // Token expires in 1 second
      const almostExpiredToken = jwt.sign(
        { sub: 1 },
        secret,
        { expiresIn: '1s' }
      );

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${almostExpiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token.');
    });
  });

  // ==========================================
  // Test 6: Valid Token (Success Case)
  // ==========================================
  describe('Valid Token (Positive Test)', () => {
    it('should allow access with valid token', async () => {
      // Register and get valid token
      const registerResponse = await request(app)
        .post('/auth/register')
        .send({
          email: 'validuser@example.com',
          password: 'password123'
        });

      const token = registerResponse.body.token;

      // Use valid token to access protected route
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'validuser@example.com');
    });
  });
});