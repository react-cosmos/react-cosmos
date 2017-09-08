#!/usr/bin/env node

const moduleExists = require('react-cosmos-utils/lib/module-exists').default;
const resolveUserPath = require('react-cosmos-utils/lib/resolve-user-path')
  .default;
const argv = require('yargs').argv;

// Babel is included by default, but --plain will run only on Node features
if (!argv.plain) {
  require('babel-register');
}

const startExport = require('../lib/export');

const cosmosConfigPath = resolveUserPath(
  process.cwd(),
  argv.config || 'cosmos.config'
);

if (cosmosConfigPath && moduleExists(cosmosConfigPath)) {
  startExport(cosmosConfigPath);
} else {
  console.warn(`[Cosmos] No config file found at ${cosmosConfigPath}!`);
  console.log(
    'Please check docs: https://github.com/react-cosmos/react-cosmos#getting-started'
  );
}
