const glob = require('glob');
const path = require('path');
const npmRun = require('npm-run');

function _runBuild(packageName) {
  const npmTask = packageName !== 'react-component-playground' ? 'build-babel' :
      'build-webpack';
  const stdout = npmRun.execSync(`PACKAGE=${packageName} npm run ${npmTask}`, {
    cwd: __dirname,
  });

  console.log(stdout.toString('utf-8'));
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
