// Startup diagnostics (verify required env + MongoDB service before starting)
import './startup-diagnostics.mjs';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log('✓ Royal Overseas API running on port', PORT);
});

