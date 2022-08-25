import { createTaskService } from '@src/services/task.service';
import { Request, Response } from 'express';

// export const createTask = async (req: Request, res: Response) => {
//     try {
//         const { errors, task } = await createTaskService(req.body);
//         if (errors) {
//             return res.status(401).json({
//                 errors,
//                 message: 'Error creating task',
//             });
//         }
//         return res.status(200).json({
//             task,
//             message: 'Task successfully created',
//         });
//     } catch (error) {
//         return res.status(500).json({
//             error: error,
//         });
//     }
// };
