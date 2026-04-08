"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToQuesue = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib_1.default.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.Rabbitmq_Username,
            password: process.env.Rabbitmq_Password,
        });
        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};
exports.connectRabbitMQ = connectRabbitMQ;
const publishToQuesue = async (queueName, message) => {
    if (!channel) {
        console.error('RabbitMQ channel is not initialized');
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
};
exports.publishToQuesue = publishToQuesue;
