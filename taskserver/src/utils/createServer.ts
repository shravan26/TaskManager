// import { router  as taskRouter } from '@src/routes/task.routes';
import express from 'express';

export const createServer = () => {
    const app = express();

    app.use(express.json());

    // app.use('/api/tasks', taskRouter);

    return app;
};
