#!/usr/bin/env node

const fs = require('fs');
const {
  default: resolveUserPath
} = require('react-cosmos-utils/lib/resolve-user-path');
const argv = require('yargs').argv;

// Babel is included by default, but --plain will run only on Node features
if (!argv.plain) {
  require('babel-register');
}

const startServer = require('../lib/server');

const cosmosConfigPath = resolveUserPath(
  process.cwd(),
  argv.config || 'cosmos.config'
);

if (cosmosConfigPath && fs.existsSync(cosmosConfigPath)) {
  startServer(cosmosConfigPath);
} else {
  console.warn(`[Cosmos] No config file found at ${cosmosConfigPath}!`);
  console.log(
    'Please check docs: https://github.com/react-cosmos/react-cosmos#getting-started'
  );
}
