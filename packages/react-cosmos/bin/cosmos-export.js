#!/usr/bin/env node

// Set the env before any code reads it
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

require('regenerator-runtime/runtime');
const { generateWebExport } = require('../dist/webExport');

generateWebExport().catch(err => {
  console.log('[Cosmos] Export failed...');
  console.log(`\n  (╯°□°)╯︵ ┻━┻\n`);
  console.log(err);
  process.exit(1);
});
