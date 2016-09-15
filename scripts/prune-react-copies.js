const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const rimraf = require('rimraf');

rimraf(path.join(__dirname, '../packages/*/node_modules/react{,-dom}'), (error) => {
  if (error) {
    throw error;
  }
  /* eslint-disable no-console */
  console.log('React copies from packages removed successfully.');
});
