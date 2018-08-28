#!/usr/bin/env node

// Set the env before any code reads it
process.env.BABEL_ENV = process.env.BABEL_ENV || 'development';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const { printFixtureFiles } = require('../dist/server/print-fixture-files');

printFixtureFiles();
