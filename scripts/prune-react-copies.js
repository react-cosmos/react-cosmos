// Child packages should keep React in peerDeps instead of deps. Sometimes
// deps of child packages mess this up so we must make sure to keep a single
// React (and affiliated modules) copy for the entire repo.
// TODO: Fix react-split-pane deps.

const glob = require('glob');
const rimraf = require('rimraf');

glob.sync('./packages/*/node_modules/react{,-dom}').forEach(
  reactCopyPath => {
    rimraf.sync(reactCopyPath);
    console.log('WARNING: Removed unwanted React copy', reactCopyPath);
  });
