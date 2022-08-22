import { UserInputParameters } from '@src/services/user.service';

export const validateUserInput = (inputObject: UserInputParameters) => {
    if (!(inputObject.email.includes('@')) || inputObject.email.length < 6) {
        return [
            {
                field: 'email',
                message: 'Please enter a valid email',
            },
        ];
    }
    if (!(inputObject.name.length > 0)) {
        return [
            {
                field: 'name',
                message: 'Please enter a valid name',
            },
        ];
    }
    if (inputObject.username.length <= 4) {
        return [
            {
                field: 'username',
                message: 'Username should be more than 4 characters',
            },
        ];
    }
    if (inputObject.password.length < 8) {
        return [
            {
                field: 'password',
                message: 'Password should be more than 8 characters',
            },
        ];
    }
    return null;
};
