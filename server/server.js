// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Startup diagnostics
import './startup-diagnostics.mjs';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect MongoDB Atlas
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✓ Royal Overseas API running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();