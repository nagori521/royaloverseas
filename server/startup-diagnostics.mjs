import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

const cwd = process.cwd();

const serverEnvPath = path.join(cwd, 'server', '.env');
const rootEnvPath = path.join(cwd, '.env');

// Load ENV
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config({ path: rootEnvPath });
}

console.log(`\n=== Startup diagnostics (${new Date().toISOString()}) ===`);

let ok = true;

// Check MONGO_URI
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI missing');
  ok = false;
} else {
  console.log('✓ MONGO_URI found');
}

// Check JWT_SECRET
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET missing');
  ok = false;
} else {
  console.log('✓ JWT_SECRET found');
}

if (!ok) {
  console.error('\nStartup aborted due to missing configuration.');
  process.exit(1);
}

console.log('✓ Startup checks passed\n');