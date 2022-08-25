import 'reflect-metadata';
import { createServer } from '@src/utils/createServer';
import { connectToDB } from '@src/utils/connection';
import { createMQConsumer } from './utils/rabbitMQConnection';

const app = createServer();
let QUEUE_NAME = 'CREATE_TASK';

let AMQP_URL = 'amqp://localhost';

let consumer: any = createMQConsumer(AMQP_URL, QUEUE_NAME);
consumer();
const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    await connectToDB();
    console.log('Server listening on port ' + PORT);
});
