import 'reflect-metadata';
import { AppDataSource, TestDataSource } from '@src/data-source';
import EventEmitter from 'events';
import amqp, { Channel, Connection, Message } from 'amqplib/callback_api';
export const InitializeDatabase = () => {
    AppDataSource.initialize()
        .then(() => {
            console.log('Successfully connected to the database');
        })
        .catch(err => {
            console.log('There was an error connecting to the database ', err);
        });
};

let exchange = 'user_exchange';
export let event = new EventEmitter();
let message;
const generateUUID = () => {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
};
export const createMQProducer = (amqpUrl: string, queueName: string) => {
    console.log('Connecting to rabbitMQ...');
    let correlationId = generateUUID();
    let replyToQueue: any;
    let ch: Channel;
    amqp.connect(amqpUrl, (connErr, conn) => {
        if (connErr) {
            throw connErr;
        }
        conn.createChannel((channelErr, channel) => {
            if (channelErr) {
                throw channelErr;
            }
            channel.assertExchange(exchange,'direct', {
                durable: false,
            });
            ch = channel;
            channel.assertQueue('', { exclusive: true }, (assertErr, q) => {
                if (assertErr) {
                    throw assertErr;
                }
                replyToQueue = q.queue;
                channel.consume(
                    replyToQueue,
                    msg => {
                        if(!msg) {
                            throw "Error in msg format";
                        }
                        if (msg?.properties.correlationId == correlationId) {
                            console.log(' [.] Got %s', JSON.parse(msg.content.toString()));
                        }
                        event.emit('data-received', JSON.parse(msg?.content.toString()));
                        // channel.ack(msg);
                    },{
                        noAck : true
                    }
                );
            });
            console.log('Connected to rabbitMQ');
        });
    });
    //Currying
    return async (msg: any) => { 
        console.log('Produce message to RabbitMQ...');
        message = await msg;
        console.log(message);
        ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            correlationId: correlationId,
            replyTo: replyToQueue,
        });
    };
};

export const testConnection = {
    async create() {
        await TestDataSource.initialize();
    },

    async close() {
        // await TestDataSource.dropDatabase();
        await TestDataSource.destroy();
    },
};
