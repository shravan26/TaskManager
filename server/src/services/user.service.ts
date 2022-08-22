import { User } from '@src/entities/User';
import { validateUserInput } from '@src/utils/validateUserInput';
import argon2 from 'argon2';
import { AppDataSource } from '@src/data-source';
import 'reflect-metadata';
import { EntityManager, QueryFailedError } from 'typeorm';
export interface UserInputParameters {
    name: string;
    username: string;
    email: string;
    password: string;
}
export interface UserResponse {
    user?: User;
    errors?: FieldError[];
}
export interface SecureUserResponse {
    user?: {
        name: string;
        email: string;
        username: string;
    };
    errors?: FieldError[];
}

export interface FieldError {
    field: string;
    message: string;
}

export const queryFailedGuard = (err: unknown): err is QueryFailedError & { code: string } =>
    err instanceof QueryFailedError;

const manager: EntityManager = AppDataSource.manager;

export const registerService = async (inputParameters: UserInputParameters): Promise<UserResponse> => {
    const errors = validateUserInput(inputParameters);
    if (errors) {
        return { errors };
    }
    const { name, username, email, password } = inputParameters;
    const hashedPassword = await argon2.hash(password);
    let user;
    try {
        user = await manager.create(User, {
            name,
            username,
            email,
            password: hashedPassword,
        });
        await manager.save(User, user);
    } catch (err) {
        if (queryFailedGuard(err)) {
            if (err.code === '23505') {
                console.log(err);
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'Username already exists',
                        },
                        {
                            field: 'email',
                            message: 'Email already exists',
                        },
                    ],
                };
            }
        }
    }

    return { user };
};

export const loginService = async (usernameOrEmail: string, password: string): Promise<SecureUserResponse> => {
    let user = await manager.findOneBy(
        User,
        usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
    );
    if (!user) {
        return {
            errors: [
                {
                    field: 'usernameOrEmail',
                    message: 'Invalid Username or Email',
                },
            ],
        };
    }
    const valid = argon2.verify(user.password, password);
    if (!valid) {
        return {
            errors: [
                {
                    field: 'password',
                    message: 'Invalid password',
                },
            ],
        };
    }
    return {
        user: {
            username: user.username,
            email: user.email,
            name: user.name,
        },
    };
};

//@TODO: update user, forget password, deleteAccount, view tasks.
