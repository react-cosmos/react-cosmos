const glob = require('glob');
const path = require('path');
const { spawn } = require('child_process');

function _runBuild(packageName) {
  const npmTask = packageName !== 'react-component-playground' ? 'build-babel' :
      'build-webpack';
  const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm',
      ['run', npmTask], {
        env: {
          $PACKAGE: packageName,
        },
      }
  );

  child.stdout.on('data', (data) => {
    console.log(data);
  });

  child.stderr.on('data', (data) => {
    console.error(data);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  child.on('error', (err) => {
    console.error(`Failed to start child process ${err}`);
  });
}

glob('./packages/*react-*', null, (err, files) => {
  const allPackages = files.map(f => path.basename(f));
  const argv = require('yargs')
      .usage('Usage: $0 <package>')
      .help()
      .argv;
  const targetPackage = argv._[0];

  if (!targetPackage) {
    allPackages.forEach(pkg => (_runBuild(pkg)));
  } else if (allPackages.includes(targetPackage)) {
    _runBuild(targetPackage);
  } else {
    throw new Error(`Invalid package! Can only build the following packages: ${allPackages}`);
  }
});
