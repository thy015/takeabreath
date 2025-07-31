const mongoose = require('mongoose');
const app = require('./server'); // your Express app, ideally as a function or module
require('dotenv').config();

const PORT = 3000;

async function startAndCheck() {
  try {
    await mongoose.connect(`mongodb+srv://thymai1510:${process.env.MONGO_DB}@cluster0.ibhghsi.mongodb.net/?appName=Cluster0`);
    console.log('✅ MongoDB connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      server.close(() => {
        console.log('✅ Health check complete. Server shut down.');
        mongoose.connection.close();
      });
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
}

startAndCheck();
