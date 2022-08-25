import 'reflect-metadata';
import { Request, Response } from 'express';
import { createServer } from '@src/config/createServer';
import * as amqp from 'amqplib/callback_api';
import { InitializeDatabase } from '@src/utils/connections';
//Initialise port number
export const PORT = process.env.PORT || 3000;

export const app = createServer();
//create a server healthcheck function
const healthCheck = (req: Request, res: Response) => {
    const health = {
        uptime: process.uptime(),
        message: 'ok',
        timestamp: Date.now(),
        responseTime: process.hrtime(),
    };
    try {
        res.status(200).send(health);
    } catch (err) {
        health.message = 'error';
        console.log(err);
        res.status(503).send(health);
    }
};

//Server healthcheck route
app.get('/healthcheck', healthCheck);
//Create server connection
app.listen(PORT, async () => {
    await InitializeDatabase();
    console.log('Listening on port ' + PORT);
});
