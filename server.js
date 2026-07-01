'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
}

// Pull latest code from GitHub
try {
  console.log('=== Pulling latest code ===');
  run('git pull origin main');
} catch (e) {
  console.error('Git pull failed (continuing with existing code):', e.message);
}

// Install / update dependencies
try {
  console.log('=== Installing dependencies ===');
  run('npm install --include=dev');
} catch (e) {
  console.error('npm install failed:', e.message);
}

// Build
console.log('=== Building app ===');
run('npx prisma generate');
run('npx next build');

// Copy static assets into standalone directory
try { run('cp -r public .next/standalone/public'); } catch (_) {}
try { fs.mkdirSync(path.join(__dirname, '.next/standalone/.next'), { recursive: true }); } catch (_) {}
try { run('cp -r .next/static .next/standalone/.next/static'); } catch (_) {}

// Start the standalone server
console.log('=== Starting server ===');
process.env.NODE_ENV = 'production';
require('./.next/standalone/server.js');
