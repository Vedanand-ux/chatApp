import mongoose from 'mongoose';

const connectDB = async () => {
  const url = process.env.MONGO_URI;

  if (!url) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(url, {
      dbName: "Chatappmicroserviceapp",
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;