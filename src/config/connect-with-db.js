// helpers/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('---')
    const mongoURI = 'mongodb+srv://shahzadsa68:YSpePjU4yEeCm9mI@cluster0.lx4bbwt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // or use your Atlas URI
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // exit if DB connection fails
  }
};

module.exports = connectDB;
