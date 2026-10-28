const mongoose = require('mongoose'); 
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message || error);
  }
};

module.exports = connectToMongo;
