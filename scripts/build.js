const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');
const spawn = require('child-process-promise').spawn;
const argv = require('yargs').argv;

const COMPONENT_PLAYGROUND = 'react-component-playground';

/**
 * Builds a package by running it through Babel or Webpack.
 * @param {Object} options
 * @param {Object} options.task
 * @param {String} options.task.name Name of the task to run.
 * @param {String} options.task.args Arguments that will be passed to the task.
 * @param {Boolean} options.watch Whether to apply watch argument.
 * @param {String} options.packageName Name of the React package to build.
 * @returns promise Child process wrapped in a Promise.
 */
function runBuildTask(options) {
  const {packageName} = options;

  const babelTask = {
    name: 'babel',
    args: [
      `packages/${packageName}/src`,
      '--out-dir', `packages/${packageName}/lib`,
      '--copy-files',
      '--ignore', '\'__tests__,__mocks_\''
    ]
  };

  const {name, args = []} = options.task || babelTask;
 
  if (options.watch) {
    args.push('--watch');
  }

  const promise = spawn(name, args, {
    cwd: path.join(__dirname, '..')
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
    task: {
      name: 'webpack',
      args: ['--config', `packages/${COMPONENT_PLAYGROUND}/webpack.config.js`]
    },
    watch
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
      console.error(
        `Cannot build all packages with the --watch argument. If you'd like to --watch, please choose one of the existing packages:
          ${formattedPackages}`
      );
    } else {
      runBuildAllTask(allPackageNames, applyWatch);
    }
  } else if (targetPackage === COMPONENT_PLAYGROUND) {
    runBuildPlaygroundTask(applyWatch);
  } else if (allPackageNames.indexOf(targetPackage) === -1) {
    console.error(
      `Invalid package! These are the existing packages:
        ${formattedPackages}`
    );
  } else {
    // Build a single package
    runBuildTask({
      packageName: targetPackage,
      watch: applyWatch
    });
  }
});
