/* eslint-disable no-console */
const glob = require('glob');
const rimraf = require('rimraf');
const path = require('path');
const { spawn } = require('child_process');
const argv = require('yargs').argv;

/**
 * Runs the build-babel or build-webpack npm target for the specified package.
 * @param options
 * @param options.npmTask Name of the npm task to run
 * @param options.watch Whether to apply watch argument
 * @param options.packageName Name of the React package to build
 */
function runBuildTask(options) {
  const task = options.npmTask || 'build-babel';
  const args = ['run', task];
  if (options.watch) {
    args.push('--', '--watch');
  }

  const child = spawn('npm', args, {
    cwd: __dirname,
    env: Object.assign({}, process.env, {
      PACKAGE: options.packageName,
    }),
  });

  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  child.on('close', (code) => {
    if (code) {
      process.stderr.write(`${options.packageName} exited with code ${code}`);
    }
  });
}

/**
 * Build CP only
 * @param watch Apply watch argument
 */
function runBuildPlaygroundTask(watch) {
  // Build CP
  runBuildTask({
    packageName: 'react-component-playground',
    npmTask: 'build-webpack',
    watch,
  });
}

/**
 * Run the build for all packages, the CP requires all other components
 * to be built first.
 * @param packageNames List of package names
 */
function runBuildAllTask(packageNames) {
  // Cleanup
  glob.sync('./packages/*/lib').forEach((packageLibPath) => {
    rimraf.sync(packageLibPath);
    console.log('WARNING: Removed lib directory for', packageLibPath);
  });

  // Build all packages except CP
  packageNames
      .filter(pkg => pkg !== 'react-component-playground')
      .forEach(packageName => (
          runBuildTask({
            packageName,
          })
        ));

  runBuildPlaygroundTask();
}

const targetPackage = argv._[0];
const applyWatch = Boolean(argv.watch);

glob('./packages/react-*', null, (err, files) => {
  const allPackagesNames = files.map(f => path.basename(f));

  if (!targetPackage) {
    runBuildAllTask(allPackagesNames, applyWatch);
  } else if (targetPackage === 'react-component-playground') {
    runBuildPlaygroundTask(applyWatch);
  } else if (allPackagesNames.includes(targetPackage)) {
    runBuildTask({
      packageName: targetPackage,
      watch: applyWatch,
    });
  } else {
    const formattedPackages = `${[''].concat(allPackagesNames).join('\n -')}`;
    console.error(`Invalid package! These are the existing packages: 
        ${formattedPackages}`);
  }
});
