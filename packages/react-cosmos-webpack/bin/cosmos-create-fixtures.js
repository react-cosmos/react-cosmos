#!/usr/bin/env node

const argv = require('yargs').argv;

// Babel is included by default, but --plain will run only on Node features
if (!argv.plain) {
  require('babel-register');
}

const startCreateFixtures = require('react-cosmos-voyager/lib/create-fixtures');

startCreateFixtures();
