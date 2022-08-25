import { DataSource } from 'typeorm';
import { User } from '@src/entities/User';
import 'reflect-metadata';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'password',
    database: 'users',
    synchronize: true,
    logging: true,
    entities: [User],
    migrationsRun: true,
    migrations: ['@src/migrations/*'],
});

export const TestDataSource = new DataSource({
    name: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'test',
    password: 'password',
    database: 'tests',
    dropSchema: true,
    logging: false,
    synchronize: true,
    entities: ["@src/entities/*.ts"],
});
