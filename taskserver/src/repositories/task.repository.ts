import { Task } from '@src/entities/Task';
import { InputOptions } from '@src/services/task.service';
import { DeepPartial, Repository } from 'typeorm';

export class TaskRepository extends Repository<Task> {
    public static create = async (data: DeepPartial<Task>) => {
        let task;
        try {
            task = Task.create(data);
            return await Task.save(task);
        } catch (error) {
            console.log('error in saving task: ', error);
        }
    };
    public static getTask = async (id: number) => {
        try {
            return await Task.findOneBy({ id: id });
        } catch (error) {
            console.log('error in finding task by id', error);
        }
    };
    public static getTasks = async () => {
        return await Task.find();
    };
    public static getTaskByUserId = async (userId: number) => {
        return await Task.findBy({ userId: userId });
    };
}
