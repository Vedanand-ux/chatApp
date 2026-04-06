import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import {createClient} from "redis";
import userRoutes from './routes/user.js';

dotenv.config();

connectDB();

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient
  .connect()
  .then(()=>{console.log('Connected to Redis');})
  .catch(console.error);

const app = express();
app.use("api/v1",userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});