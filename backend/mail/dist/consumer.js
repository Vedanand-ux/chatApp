"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSendOtpConsumer = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config();
const startSendOtpConsumer = async () => {
    try {
        const connection = await amqplib_1.default.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME,
            password: process.env.RABBITMQ_PASSWORD,
        });
        const channel = await connection.createChannel();
        const queueName = 'send_otp';
        await channel.assertQueue(queueName, { durable: true });
        console.log("✅ Mail service started, Listening for otp emails");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());
                    const transporter = nodemailer_1.default.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.USER,
                            pass: process.env.PASSWORD
                        },
                    });
                    await transporter.sendMail({
                        from: `"Chat App" <vvinny021@gmail.com>`,
                        to,
                        subject,
                        text: body,
                    });
                    console.log(`✅ OTP email sent to ${to}`);
                    channel.ack(msg);
                }
                catch (error) {
                    console.error('Failed to send Otp', error);
                }
            }
        });
    }
    catch (error) {
        console.error('Failed to start RabbitMQ consumer ', error);
    }
};
exports.startSendOtpConsumer = startSendOtpConsumer;
