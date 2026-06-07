const mongoose = require('mongoose');

const dbURI = process.env.MONGO_URI || 'mongodb://ahmed:ahmed12345@ac-kfvdlxu-shard-00-00.5fcxzfs.mongodb.net:27017,ac-kfvdlxu-shard-00-01.5fcxzfs.mongodb.net:27017,ac-kfvdlxu-shard-00-02.5fcxzfs.mongodb.net:27017/test?ssl=true&authSource=admin&retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
