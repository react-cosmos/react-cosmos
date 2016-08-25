var path = require('path');
var rimraf = require('rimraf');

rimraf(path.join(__dirname, '../packages/*/node_modules/react{,-dom}'), function(error) {
  if (error) {
    throw error;
  }
  console.log('React copies from packages removed successfully.')
});
