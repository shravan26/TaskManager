import { createTaskService, loginService, registerService } from '@src/services/user.service';
import { createMQProducer, event } from '@src/utils/connections';
import { Request, Response } from 'express';
const AMQP_URL = 'amqp://localhost';

const QUEUE_NAME = 'CREATE_TASK';

const producer = createMQProducer(AMQP_URL, QUEUE_NAME);

export const register = async (req: Request, res: Response) => {
    const { user, errors } = await registerService(req.body);
    if (errors) {
        return res.status(401).json(errors);
    } else {
        return res.status(200).json({
            user,
            message: 'Successfully registered user',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { user, errors } = await loginService(req.body.usernameOrEmail, req.body.password);
    if (errors) {
        return res.status(401).json(errors);
    } else {
        return res.status(200).json(user);
    }
};

export const createTask = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    let inputOptions = {
        userId,
        description: req.body.description,
    };
    const msg = createTaskService(inputOptions);
    await producer(msg);
    event.on('data-received', async data => {
        const {statusCode, task} = await data;
        if (statusCode === 200) {
            return res.status(200).json(task);
        } else {
            res.status(statusCode).json(task);
            return;
        }
    });
};
