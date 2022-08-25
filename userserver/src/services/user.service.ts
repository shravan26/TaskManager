import { AppDataSource } from '@src/data-source';
import { User } from '@src/entities/User';
import { validateUserInput } from '@src/utils/validateUserInput';
import argon2 from 'argon2';
import 'reflect-metadata';
import { QueryFailedError, Repository } from 'typeorm';
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

export interface TaskInput {
    description: string;
    userId: number;
}

export interface FieldError {
    field: string;
    message: string;
}

export const queryFailedGuard = (err: unknown): err is QueryFailedError & { code: string } =>
    err instanceof QueryFailedError;

const UserRepository: Repository<User> = AppDataSource.getRepository(User);

export const registerService = async (inputParameters: UserInputParameters): Promise<UserResponse> => {
    const errors = validateUserInput(inputParameters);
    if (errors) {
        return { errors };
    }
    const { name, username, email, password } = inputParameters;
    const hashedPassword = await argon2.hash(password);
    let user = new User();
    try {
        UserRepository.merge(user, {
            name,
            username,
            email,
            password: hashedPassword,
        });
        await UserRepository.save(user);
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
    let user;
    try {
        user = await UserRepository.findOneBy(
            usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
        );
        console.log(user);
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
        const valid = await argon2.verify(user.password, password);
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
    } catch (error) {
        console.error(error);
        return {
            errors: [
                {
                    field: 'usernameOrEmail',
                    message: 'Error in logging in',
                },
            ],
        };
    }
};

//@TODO: update user, forget password, deleteAccount, view tasks, create task.

export const createTaskService = async (inputOption: TaskInput) => {
    const msg = {
        userId: inputOption.userId,
        description: inputOption.description,
    };
    return msg;
};
