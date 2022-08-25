import { InputOptions } from '@src/services/task.service';

export const validateTaskInput = (inputOptions: InputOptions) => {
    if (inputOptions.userId === undefined) {
        return [{ field: 'userId', message: 'User token may have expired' }];
    }
    if (inputOptions.description.trim().length < 1) {
        return [
            {
                field: 'description',
                message: 'Cannot have an empty task',
            },
        ];
    }
    return null;
};
