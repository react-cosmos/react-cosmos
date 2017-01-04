const glob = require('glob');
const path = require('path');
const npmRun = require('npm-run');
const yargs = require('yargs');

/**
 * Runs the build-babel or build-webpack npm target for the specified package.
 * @param packageName Name of the package as listed in ./packages/
 * @param npmTask Name of the npm task, defaults to build-babel
 */
function runBuildTask(packageName, npmTask) {
  const task = npmTask || 'build-babel';
  const stdout = npmRun.execSync(`PACKAGE=${packageName} npm run ${task}`, {
    cwd: __dirname,
  });

  /* eslint-disable no-console */
  console.log(stdout.toString('utf-8'));
}

/**
 * Run the build for Component Playground, since it's a webpack build it
 * requires all other components to be built first.
 * @param packageNames List of package names
 */
function runBuildPlayground(packageNames) {
  packageNames
      .filter(pkg => pkg !== 'react-component-playground')
      .forEach(pkg => (runBuildTask(pkg)));
  runBuildTask('react-component-playground', 'build-webpack');
}

glob('./packages/react-*', null, (err, files) => {
  const allPackagesNames = files.map(f => path.basename(f));
  const argv = yargs
      .usage('Usage: $0 <package>')
      .help()
      .argv;
  const targetPackage = argv._[0];

  if (!targetPackage || targetPackage === 'react-component-playground') {
    // NOTE: The Playground needs to be built after everything else
    runBuildPlayground(allPackagesNames);
  } else if (allPackagesNames.includes(targetPackage)) {
    runBuildTask(targetPackage);
  } else {
    throw new Error(`Invalid package! Can only build the following packages: ${allPackagesNames}`);
  }
});
