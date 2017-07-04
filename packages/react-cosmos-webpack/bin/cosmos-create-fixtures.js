#!/usr/bin/env node

const argv = require('yargs').argv;

// Babel is included by default, but --plain will run only on Node features
if (!argv.plain) {
  require('babel-register');
}

const startCreateFixtures = require('../lib/create-fixtures');

startCreateFixtures();
