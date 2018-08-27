// @flow

exports.moduleExists = require('./src/server/module-exists').moduleExists;
exports.resolveUserPath = require('./src/server/resolve-user-path').resolveUserPath;
exports.slash = require('./src/server/slash-path').slash;

exports.defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
  '**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
];
exports.defaultFileMatchIgnore = '**/node_modules/**';
exports.defaultExclude = [];
