const glob = require('glob');
const path = require('path');
const { spawn } = require('child_process');
const argv = require('yargs').argv;

/**
 * Runs the build-babel or build-webpack npm target for the specified package.
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
 * Run the build for Component Playground, since it's a webpack build it
 * requires all other components to be built first.
 * @param packageNames List of package names
 * @param watch Whether to apply watch argument to the running task
 */
function runBuildPlayground(packageNames, watch) {
  packageNames
      .filter(pkg => pkg !== 'react-component-playground')
      .forEach(packageName => (
          runBuildTask({
            packageName,
          })
        ));
  runBuildTask({
    packageName: 'react-component-playground',
    npmTask: 'build-webpack',
    watch,
  });
}

const targetPackage = argv._[0];
const applyWatch = Boolean(argv.watch);

glob('./packages/react-*', null, (err, files) => {
  const allPackagesNames = files.map(f => path.basename(f));

  if (!targetPackage || targetPackage === 'react-component-playground') {
    // NOTE: The Playground needs to be built after everything else
    runBuildPlayground(allPackagesNames, applyWatch);
  } else if (allPackagesNames.includes(targetPackage)) {
    runBuildTask({
      packageName: targetPackage,
      watch: applyWatch,
    });
  } else {
    throw new Error(`Invalid package! Can only build the following packages: ${allPackagesNames}`);
  }
});
