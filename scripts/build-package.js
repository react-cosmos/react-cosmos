const glob = require('glob');
const path = require('path');
const npmRun = require('npm-run');
const yargs = require('yargs');

/**
 * Runs the build-babel or build-webpack npm target for the specified package.
 * @param packageName Name of the package as listed in ./packages/
 */
function runBuildTask(packageName) {
  const npmTask = packageName !== 'react-component-playground' ? 'build-babel' :
      'build-webpack';
  const stdout = npmRun.execSync(`PACKAGE=${packageName} npm run ${npmTask}`, {
    cwd: __dirname,
  });

  /* eslint-disable no-console */
  console.log(stdout.toString('utf-8'));
}

glob('./packages/*react-*', null, (err, files) => {
  const allPackages = files.map(f => path.basename(f));
  const argv = yargs
      .usage('Usage: $0 <package>')
      .help()
      .argv;
  const targetPackage = argv._[0];

  if (!targetPackage) {
    allPackages.forEach(pkg => (runBuildTask(pkg)));
  } else if (allPackages.includes(targetPackage)) {
    runBuildTask(targetPackage);
  } else {
    throw new Error(`Invalid package! Can only build the following packages: ${allPackages}`);
  }
});
