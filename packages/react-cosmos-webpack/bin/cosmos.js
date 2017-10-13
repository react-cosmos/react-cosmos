#!/usr/bin/env node

// TODO: Put this in one place and reuse in all binaries
const moduleExists = require('react-cosmos-utils/lib/module-exists').default;
const resolveUserPath = require('react-cosmos-utils/lib/resolve-user-path')
  .default;
const argv = require('yargs').argv;

// Babel is included by default, but --plain will run only on Node features
if (!argv.plain) {
  // TODO: Remove. Server is already compiled and the babel-register dependency
  // only complicates things
  require('babel-register');
}

const startServer = require('../lib/server');

// TODO: Put this in one place and reuse in all binaries
const cosmosConfigPath = resolveUserPath(
  process.cwd(),
  argv.config || 'cosmos.config'
);

if (cosmosConfigPath && moduleExists(cosmosConfigPath)) {
  startServer(cosmosConfigPath);
} else {
  console.warn(`[Cosmos] No config file found at ${cosmosConfigPath}!`);
  console.log(
    'Please check docs: https://github.com/react-cosmos/react-cosmos#getting-started'
  );
}
