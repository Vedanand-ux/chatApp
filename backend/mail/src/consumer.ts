import amqp from 'amqplib';
import dotenv from  'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const startSendOtpConsumer = async() =>{
  try{
    const connection = await amqp.connect({
       protocol: 'amqp',
      hostname: process.env.RABBITMQ_HOST,
      port: 5672,
      username: process.env.Rabbitmq_Username,
      password: process.env.Rabbitmq_Password,
    });
     const channel = await connection.createChannel();
     const queueName = 'send_otp';
     await channel.assertQueue(queueName, { durable: true });
     console.log("✅ Mail service started, Listening for otp emails");

     channel.consume(queueName,async(msg)=>{
      if(msg){
        try{
          const {to,subject,body} = JSON.parse(msg.content.toString())

          const transporter = nodemailer.createTransport({
            host: 'smtp.email.com',
            port:465,
            auth:
            {
              user:process.env.USER,
              pass:process.env.PASSWORD
            },  
          })
          
          await transporter.sendMail({
            from:"Chat App",
            to,
            subject,
            text:body,
          })

          console.log(`✅ OTP email sent to ${to}`);
          channel.ack(msg);
        }catch(error){
          console.error('Failed to send Otp', error);
        }
      }
     })

  }catch(error){
    console.error('Failed to start RabbitMQ consumer ', error);
  }
}