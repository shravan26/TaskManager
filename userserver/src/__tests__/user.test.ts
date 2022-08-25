import { createServer } from '@src/config/createServer';
import { testConnection } from '@src/utils/connections';
import supertest from 'supertest';
let app = createServer();
beforeAll(async () => {
    await testConnection.create();
    // server = await app.listen(4000);
});

afterAll(async () => {
    await testConnection.close();
    // server.close();
});
let registeredUser = {
    usernameOrEmail: 'shravan26',
    password: 'shravan98',
};
let testUser = {
    name: 'shravan',
    username: 'shravan26',
    email: 'shravan@gmail.com',
    password: 'shravan98',
};
describe('POST /register', () => {
    it('should register user if all fields exist', async () => {
        const response = await supertest(app).post('/api/users/register').send(testUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Successfully registered user');
    });
    it('should throw error if email field is missing', async () => {
        let testUser = {
            name: 'shravan',
            username: 'shravan26',
            email: 'email',
            password: 'shravan98',
        };

        const response = await supertest(app).post('/api/users/register').send(testUser);
        expect(response.statusCode).toBe(401);
        expect(response.body[0].field).toBe('email');
        expect(response.body[0].message).toBe('Please enter a valid email');
    });
    it('should throw error if email is invalid', async () => {
        let testUser = {
            name: 'shravan',
            username: 'shravan26',
            email: '@',
            password: 'shravan98',
        };
        const response = await supertest(app).post('/api/users/register').send(testUser);
        expect(response.statusCode).toBe(401);
        expect(response.body[0].field).toBe('email');
        expect(response.body[0].message).toBe('Please enter a valid email');
    });
    it('should throw error if name is empty', async () => {
        let testUser = {
            name: '',
            username: 'shravan26',
            email: 'shravan@gmail.com',
            password: 'shravan98',
        };
        const response = await supertest(app).post('/api/users/register').send(testUser);
        expect(response.statusCode).toBe(401);
        expect(response.body[0].field).toBe('name');
        expect(response.body[0].message).toBe('Please enter a valid name');
    });
    it('should throw error if username is less than 4 characters', async () => {
        let testUser = {
            name: 'shravan',
            username: '',
            email: 'shravan@gmail.com',
            password: 'shravan98',
        };
        const response = await supertest(app).post('/api/users/register').send(testUser);
        expect(response.statusCode).toBe(401);
        expect(response.body[0].field).toBe('username');
        expect(response.body[0].message).toBe('Username should be more than 4 characters');
    });
    it('should throw error if password is less than 8 characters', async () => {
        let testUser = {
            name: 'shravan',
            username: 'shravan26',
            email: 'shravan@gmail.com',
            password: 'shr',
        };
        const response = await supertest(app).post('/api/users/register').send(testUser);
        expect(response.statusCode).toBe(401);
        expect(response.body[0].field).toBe('password');
        expect(response.body[0].message).toBe('Password should be more than 8 characters');
    });
    it('should login a registered user', async () => {
        const loginResponse = await supertest(app).post('/api/users/login').send(registeredUser);
        expect(loginResponse.statusCode).toBe(200);
    });
});
