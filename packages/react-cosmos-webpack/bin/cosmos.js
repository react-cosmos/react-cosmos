#!/usr/bin/env node

const argv = require('yargs').argv;

// Babel is included by default, but --plain will run only on Node features
if (!argv.plain) {
  // eslint-disable-next-line global-require
  require('babel-register');
}

const startServer = require('../lib/server');

startServer();
