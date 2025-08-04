/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/register (POST) - should register a new user', () => {
    const userData = {
      email: `test-register-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('message');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('email');
        expect(res.body.user).toHaveProperty('name');
        expect(res.body.user).toHaveProperty('isEmailVerified');
        expect(res.body.user.email).toBe(userData.email);
        expect(res.body.user.name).toBe(userData.name);
        expect(res.body.user.isEmailVerified).toBe(false);
        expect(res.body.user.password).toBeNull();
      });
  });

  it('/auth/register (POST) - should fail with duplicate email', async () => {
    const userData = {
      email: `duplicate-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    };

    // Register first user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    // Try to register with same email
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(409); // Conflict
  });

  it('/auth/check-email (GET) - should check if email exists', () => {
    const email = `check-email-${Date.now()}@example.com`;

    return request(app.getHttpServer())
      .get('/auth/check-email')
      .send({ email })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('exists');
        expect(res.body.exists).toBe(false);
      });
  });

  it('/auth/check-email (GET) - should return true for existing email', async () => {
    const userData = {
      email: `existing-email-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    };

    // Register user first
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    // Check if email exists
    return request(app.getHttpServer())
      .get('/auth/check-email')
      .send({ email: userData.email })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('exists');
        expect(res.body.exists).toBe(true);
      });
  });

  it('/auth/login (POST) - should fail for unverified email', async () => {
    const userData = {
      email: `unverified-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Test User',
    };

    // Register user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    // Try to login with unverified email
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(400); // Bad Request - email not verified
  });

  it('/auth/login (POST) - should fail with invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      })
      .expect(401); // Unauthorized
  });

  it('/auth/verify-email (GET) - should fail with invalid token', () => {
    return request(app.getHttpServer())
      .get('/auth/verify-email')
      .send({ token: 'invalid-token' })
      .expect(400); // Bad Request
  });

  it('/auth/me (GET) - should fail without token', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(500); // Internal Server Error (no token provided)
  });

  it('/auth/logout (POST) - should fail without token', () => {
    return request(app.getHttpServer()).post('/auth/logout').expect(500); // Internal Server Error (no token provided)
  });
});
