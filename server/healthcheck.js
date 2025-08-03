const mongoose = require('mongoose');
const app = require('./server'); // your Express app
require('dotenv').config();

const PORT = 3000;

async function startAndCheck() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      `mongodb+srv://thymai1510:${process.env.MONGO_DB}@cluster0.ibhghsi.mongodb.net/?appName=Cluster0`,
      { serverSelectionTimeoutMS: 5000 }
    );
    console.log('✅ MongoDB connected');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Wait briefly to ensure the server is fully up (optional, for health check reliability)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Shut down the server
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error('❌ Server shutdown failed:', err);
          return reject(err);
        }
        console.log('✅ Health check complete. Server shut down.');
        resolve();
      });
    });

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');

    // Explicitly exit the process
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

startAndCheck();