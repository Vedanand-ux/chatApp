import ampq from 'amqplib';

let channel: ampq.Channel;
export const connectRabbitMQ = async() =>{
  try {
    const connection = await ampq.connect({
      protocol: 'amqp',
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });

    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
  }catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

export const publishToQuesue = async(queueName: string, message: any) =>{
  if (!channel) {
    console.error('RabbitMQ channel is not initialized');
    return;
  }
  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{ persistent: true });
  

} 