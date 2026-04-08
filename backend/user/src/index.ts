import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import {createClient} from "redis";
import userRoutes from './routes/user';
import { connectRabbitMQ } from './config/rabbitmq.js';

dotenv.config();

connectDB();

connectRabbitMQ();

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient
  .connect()
  .then(()=>{console.log('Connected to Redis');})
  .catch(console.error);

const app = express();

app.use(express.json());
app.use("/api/v1",userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});