import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Mongo URI Loaded:', process.env.MONGO_URI);

    if (!process.env.MONGO_URI) {
      throw new Error(
        'MONGO_URI environment variable is not defined. Ensure server/.env (or root .env) contains MONGO_URI.'
      );
    }


    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
