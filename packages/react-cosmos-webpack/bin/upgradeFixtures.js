#!/usr/bin/env node

const moduleExists = require('react-cosmos-utils/lib/module-exists').default;
const resolveUserPath = require('react-cosmos-utils/lib/resolve-user-path')
  .default;
const argv = require('yargs').argv;

const upgradeFixtures = require('../lib/upgradeFixtures').default;

const cosmosConfigPath = resolveUserPath(
  process.cwd(),
  argv.config || 'cosmos.config'
);

if (cosmosConfigPath && moduleExists(cosmosConfigPath)) {
  upgradeFixtures(cosmosConfigPath);
}
