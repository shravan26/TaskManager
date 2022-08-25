import { Task } from '@src/entities/Task';
import { TaskRepository } from '@src/repositories/task.repository';
import { createMQConsumer, event } from '@src/utils/rabbitMQConnection';
import { validateTaskInput } from '@src/utils/validateTaskInput';

export interface InputOptions {
    description: string;
    userId: number;
}
export interface TaskResponse {
    task?: Task;
    errors?: FieldError[];
}

export interface FieldError {
    field: string;
    message: string;
}

export const createTaskService = async (data: InputOptions) => {
    // let errors = validateTaskInput(inputOptions);
    // if (errors) {
    //     return { errors };
    // }
    // const task = await TaskRepository.create(inputOptions);
    console.log(data);
    try {
        let task = await TaskRepository.create(data);
        event.emit('request-resolved', {
            statusCode: 200,
            task,
        });
    } catch (error) {
        event.emit('request-resolved', {
            statusCode: 500,
            message: 'Error creating task',
        });
    }
};
// return { task };
