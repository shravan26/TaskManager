import { AppDataSource, TestDataSource } from '@src/data-source';
import 'reflect-metadata';

export const InitializeDatabase = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('Successfully connected to the database');
        })
        .catch(err => {
            console.log('There was an error connecting to the database ', err);
        });
};

export const testConnection = {
    async create() {
        await TestDataSource.initialize();
    },

    async close() {
        await TestDataSource.dropDatabase();
        await TestDataSource.destroy();
    },
};
