#!/usr/bin/env node

// Set the env before any code reads it
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { startDevServer } = await import('../dist/devServer/startDevServer.js');

startDevServer('native').catch(err => {
  console.log('[Cosmos] Server crashed...');
  console.log(`\n  (╯°□°)╯︵ ┻━┻\n`);
  console.log(err);
  process.exit(1);
});
