import { createTaskService } from '@src/services/task.service';
import { Message } from 'amqplib';
import * as amqp from 'amqplib/callback_api';
import EventEmitter from 'events';

export let event = new EventEmitter();
let exchange = 'user_exchange';
export const createMQConsumer = (amqpUrl: string, queueName: string) => {
    return () => {
        console.log('Connecting to rabbitMQ...');

        amqp.connect(amqpUrl, (connErr, conn) => {
            if (connErr) {
                throw connErr;
            }
            conn.createChannel((channelErr, channel) => {
                if (channelErr) {
                    throw channelErr;
                }
                console.log('Connected to rabbitMQ');
                channel.assertQueue(queueName, { durable: false });
                channel.prefetch(1);
                channel.bindQueue(queueName, exchange,'#');
                console.log('Awaiting requests');
                channel.consume(queueName, msg => {
                    if(!msg) {
                        throw "Error";
                    }
                    console.log('connected to ', queueName, JSON.parse(msg?.content.toString()));
                    event.emit('request-received',msg?.content);
                    event.on('request-resolved', data => {
                        channel.sendToQueue(msg?.properties.replyTo, Buffer.from(JSON.stringify(data)), {
                            correlationId: msg?.properties.correlationId,
                        });
                    });
                    let inputOptions = JSON.parse(msg?.content.toString());
                    console.log(inputOptions);
                    createTaskService(inputOptions);
                    channel.ack(msg);
                });
            });
        });
    };
};
