// @flow

exports.moduleExists = require('./dist/server/module-exists').moduleExists;
exports.resolveUserPath = require('./dist/server/resolve-user-path').resolveUserPath;

exports.defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
  '**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
];
exports.defaultExclude = [];
