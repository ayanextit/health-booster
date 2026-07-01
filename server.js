'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
}

console.log('=== Building app ===');
run('npx prisma generate');
run('npx next build');

// Copy public + static into standalone directory
try { run('cp -r public .next/standalone/public'); } catch (_) {}
try { fs.mkdirSync('.next/standalone/.next', { recursive: true }); } catch (_) {}
try { run('cp -r .next/static .next/standalone/.next/static'); } catch (_) {}

console.log('=== Starting server ===');
process.env.NODE_ENV = 'production';
require('./.next/standalone/server.js');
