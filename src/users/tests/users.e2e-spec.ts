/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { User } from '../../../generated/prisma';

describe('UsersController (e2e)', () => {
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

  it('/users (GET) - should return users array', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        // Check if each user has the correct structure according to schema.prisma
        res.body.forEach((user: any) => {
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('createdAt');
          expect(user).toHaveProperty('updatedAt');
          expect(typeof user.id).toBe('number');
          expect(typeof user.email).toBe('string');
          expect(user.name === null || typeof user.name === 'string').toBe(
            true,
          );
        });
      });
  });

  it('/users (POST) - should create a new user with all fields', () => {
    const userData = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201)
      .expect((res) => {
        const user: User = res.body;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(typeof user.id).toBe('number');
        expect(user.email).toBe(userData.email);
        expect(user.name).toBe(userData.name);
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
      });
  });

  it('/users (POST) - should create a user without name', () => {
    const userData = {
      email: `test-no-name-${Date.now()}@example.com`,
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201)
      .expect((res) => {
        const user: User = res.body;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(typeof user.id).toBe('number');
        expect(user.email).toBe(userData.email);
        expect(user.name).toBeNull();
      });
  });

  it('/users/:id (GET) - should get user by id', async () => {
    // First create a user
    const userData = {
      email: `gettest-${Date.now()}@example.com`,
      name: 'Get Test User',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    const userId = createResponse.body.id;

    // Then get the user by id
    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect((res) => {
        const user: User = res.body;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(user.id).toBe(userId);
        expect(user.email).toBe(userData.email);
        expect(user.name).toBe(userData.name);
      });
  });

  it('/users/:id (GET) - should return empty object for non-existent user', () => {
    return request(app.getHttpServer())
      .get('/users/99999')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({});
      });
  });

  it('/users/:id (PUT) - should update user name', async () => {
    // First create a user
    const userData = {
      email: `updatetest-${Date.now()}@example.com`,
      name: 'Update Test User',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    const userId = createResponse.body.id;

    // Then update the user
    const updateData = {
      name: 'Updated Name',
    };

    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        const user: User = res.body;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(user.id).toBe(userId);
        expect(user.email).toBe(userData.email);
        expect(user.name).toBe(updateData.name);
      });
  });

  it('/users/:id (PUT) - should update user email', async () => {
    // First create a user
    const userData = {
      email: `updatetest-email-${Date.now()}@example.com`,
      name: 'Update Email Test User',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    const userId = createResponse.body.id;

    // Then update the user email
    const updateData = {
      email: `updated-${Date.now()}@example.com`,
    };

    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        const user: User = res.body;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(user.id).toBe(userId);
        expect(user.email).toBe(updateData.email);
        expect(user.name).toBe(userData.name);
      });
  });

  it('/users/:id (DELETE) - should delete user', async () => {
    // First create a user
    const userData = {
      email: `deletetest-${Date.now()}@example.com`,
      name: 'Delete Test User',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    const userId = createResponse.body.id;

    // Then delete the user
    return request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .expect(200)
      .expect((res) => {
        const user: User = res.body;
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(user.id).toBe(userId);
        expect(user.email).toBe(userData.email);
        expect(user.name).toBe(userData.name);
      });
  });

  it('/users (POST) - should fail with duplicate email', async () => {
    const timestamp = Date.now();
    const userData = {
      email: `duplicate-${timestamp}@example.com`,
      name: 'Duplicate Test User',
    };

    // Create first user
    await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    // Try to create second user with same email
    return request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(500); // Should fail due to unique constraint
  });

  it('/users (POST) - should accept invalid email format (Prisma allows it)', () => {
    const userData = {
      email: `invalid-email-${Date.now()}`,
      name: 'Invalid Email User',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201); // Note: Prisma doesn't validate email format by default
  });
});
