import fs from 'node:fs';
import { execSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import dotenv from 'dotenv';

const cwd = process.cwd();
// Always evaluate these relative to the project root (where npm run server is executed from)
const serverEnvPath = path.join(cwd, 'server', '.env');
const rootEnvPath = path.join(cwd, '.env');

function printError(title, details) {
  const header = `\n✗ ${title}`;
  const body = details ? `\n  ${details}` : '';
  console.error(header + body);
}

function printOk(title, details) {
  const header = `\n✓ ${title}`;
  const body = details ? `\n  ${details}` : '';
  console.log(header + body);
}

function fileExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function loadEnvWithHints() {
  // Load ENV BEFORE checks that read process.env
  const serverResult = dotenv.config({ path: serverEnvPath, override: false });
  if (serverResult?.error) {
    // Fallback to root env
    dotenv.config({ path: rootEnvPath, override: false });
  }

  return {
    loadedFrom: fileExists(serverEnvPath) ? 'server/.env' : fileExists(rootEnvPath) ? '.env' : 'none',
  };
}

function tryMongoPing() {
  // Best-effort checks: service running first, then optional port check.
  // We avoid adding dependencies; we just check OS/service state and/or port availability.
  const platform = os.platform();

  // 1) Service check on Windows
  if (platform === 'win32') {
    const candidates = ['MongoDB', 'MongoDB Server'];
    for (const name of candidates) {
      try {
        const out = execSync(`sc query "${name}"`, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
        // Output contains: "STATE              : 4  RUNNING"
        if (/STATE\s*:\s*\d+\s+RUNNING/i.test(out)) return true;
        // If service exists but not running, continue to next candidate
      } catch {
        // ignore
      }
    }

    // 2) If no service match, try common port check
    try {
      const netOut = execSync('powershell -NoProfile -Command "(Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue).TcpTestSucceeded"', {
        stdio: ['ignore', 'pipe', 'pipe'],
      }).toString();
      if (/True/i.test(netOut)) return true;
    } catch {
      // ignore
    }

    return false;
  }

  // 3) Non-Windows: attempt systemctl or lsof via best-effort
  try {
    const out = execSync('systemctl is-active mongodb || true', { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
    if (/active/i.test(out)) return true;
  } catch {
    // ignore
  }

  try {
    // If lsof exists, check port 27017
    execSync('lsof -i :27017 -sTCP:LISTEN -nP >/dev/null 2>&1', { stdio: ['ignore', 'ignore', 'ignore'] });
    return true;
  } catch {
    // ignore
  }

  return false;
}

function validateEnvVar(name, help) {
  const val = process.env[name];
  if (!val || !String(val).trim()) {
    printError(`Missing ${name}`, help);
    return false;
  }
  printOk(`${name} found`);
  return true;
}

const env = loadEnvWithHints();

console.log(`\n=== Startup diagnostics (${new Date().toISOString()}) ===`);
console.log(`Env source: ${env.loadedFrom}`);

let ok = true;

// 1) server/.env exists (explicit requirement)
if (!fileExists(serverEnvPath)) {
  ok = false;
  printError(
    'server/.env does not exist',
    `Create c:/Users/Zahirabbas/OneDrive/Desktop/royaloverseas/server/.env (or run your app from the project root with that file in place).` +
      `\nAlso ensure it contains: MONGO_URI and JWT_SECRET.`
  );
} else {
  printOk('server/.env exists', `Path: ${serverEnvPath}`);
}

// 2) Validate required env vars
ok = validateEnvVar(
  'MONGO_URI',
  'Add MONGO_URI in server/.env (example: mongodb://127.0.0.1:27017/royaloverseas).'
) && ok;

ok = validateEnvVar(
  'JWT_SECRET',
  'Add JWT_SECRET in server/.env (example: a long random string).'
) && ok;

// 3) MongoDB service running
const mongoRunning = tryMongoPing();
if (!mongoRunning) {
  ok = false;
  printError(
    'MongoDB service is not running',
    platformMongoHelp()
  );
} else {
  printOk('MongoDB is running (detected)', 'Port/service appears reachable.');
}

if (!ok) {
  console.error('\nStartup aborted due to configuration problems.');
  process.exit(1);
}

console.log('\n=== Diagnostics passed ===\n');

function platformMongoHelp() {
  if (os.platform() === 'win32') {
    return 'On Windows, start MongoDB service (e.g., Services.msc -> MongoDB -> Start) or run mongod. Ensure it listens on 127.0.0.1:27017.';
  }
  return 'Start MongoDB (e.g., systemctl start mongodb) or ensure it is listening on 127.0.0.1:27017.';
}

