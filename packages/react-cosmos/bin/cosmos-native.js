#!/usr/bin/env node

// Set the env before any code reads it
process.env.BABEL_ENV = process.env.BABEL_ENV || 'development';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { startCosmosServer } = require('../dist/server/native/start');

startCosmosServer();
