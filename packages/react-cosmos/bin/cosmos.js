#!/usr/bin/env node

import { startDevServer } from '../dist/server/devServer/startDevServer.js';

// Set the env before any code reads it
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Auto disable Fast Refresh in CRA 4 until integration is implemented
// https://github.com/react-cosmos/react-cosmos/issues/1272
process.env.FAST_REFRESH = process.env.FAST_REFRESH || false;

startDevServer('web').catch(err => {
  console.log('[Cosmos] Server crashed...');
  console.log(`\n  (╯°□°)╯︵ ┻━┻\n`);
  console.log(err);
  process.exit(1);
});
