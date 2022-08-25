import { DataSource } from 'typeorm';
import { Task } from '@src/entities/Task';

export const AppDataSource = new DataSource({
    name: 'tasks',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'password',
    logging: true,
    synchronize: true,
    database: 'tasks',
    entities: [Task],
    migrationsRun: true,
    migrations: ['@src/migrations/*'],
});
