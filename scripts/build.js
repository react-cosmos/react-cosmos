const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');
const spawn = require('child-process-promise').spawn;
const argv = require('yargs').argv;

const COMPONENT_PLAYGROUND = 'react-component-playground';

/**
 * Runs the build-babel or build-webpack npm target for the specified package.
 * @param options
 * @param options.npmTask Name of the npm task to run
 * @param options.watch Whether to apply watch argument
 * @param options.packageName Name of the React package to build
 * @returns promise Child process wrapped in a Promise
 */
function runBuildTask(options) {
  const task = options.npmTask || 'build-babel';
  const args = ['run', task];
  if (options.watch) {
    args.push('--', '--watch');
  }

  const promise = spawn('npm', args, {
    cwd: __dirname,
    env: Object.assign({}, process.env, {
      PACKAGE: options.packageName,
    }),
  });

  const child = promise.childProcess;

  child.stdout.on('data', data => {
    process.stdout.write(data);
  });

  child.stderr.on('data', data => {
    process.stderr.write(data);
  });

  child.on('close', code => {
    if (code) {
      process.stderr.write(`${options.packageName} exited with code ${code}`);
    }
  });

  return promise;
}

/**
 * Build CP only
 * @param watch Apply watch argument
 */
function runBuildPlaygroundTask(watch) {
  return runBuildTask({
    packageName: COMPONENT_PLAYGROUND,
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
  glob.sync('./packages/*/lib').forEach(packageLibPath => {
    rimraf.sync(packageLibPath);
    console.log('INFO: Removed lib directory for', packageLibPath);
  });

  // Build all packages and after finishing, build CP
  const promises = packageNames
      .filter(pkg => pkg !== COMPONENT_PLAYGROUND)
      .map(packageName => runBuildTask({ packageName }));

  Promise.all(promises).then(() => {
    runBuildPlaygroundTask();
  });
}

// Read CLI arguments
const targetPackage = argv._[0];
const applyWatch = Boolean(argv.watch);

/**
 * Read all the react-* packages, and decide what to build based
 * on command line arguments.
 */
glob('./packages/react-*', null, (err, files) => {
  const allPackageNames = files.map(f => path.basename(f));
  const formattedPackages = `${[''].concat(allPackageNames).join('\n - ')}`;

  if (!targetPackage) {
    // Build all packages
    if (applyWatch) {
      console.error(`Cannot build all packages with the --watch argument. If you'd like to --watch, please choose one of the existing packages:
          ${formattedPackages}`);
    } else {
      runBuildAllTask(allPackageNames, applyWatch);
    }
  } else if (targetPackage === COMPONENT_PLAYGROUND) {
    runBuildPlaygroundTask(applyWatch);
  } else if (allPackageNames.indexOf(targetPackage) === -1) {
    console.error(`Invalid package! These are the existing packages:
        ${formattedPackages}`);
  } else {
    // Build a single package
    runBuildTask({
      packageName: targetPackage,
      watch: applyWatch,
    });
  }
});
