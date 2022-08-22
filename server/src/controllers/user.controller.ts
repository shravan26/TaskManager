import { loginService, registerService } from '@src/services/user.service';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
    const { user, errors } = await registerService(req.body);
    if (errors) {
        return res.status(401).json(errors);
    } else {
        return res.status(200).json({
            user,
            message:  "Successfully registered user"
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
