// @flow

import { spawn } from 'child-process-promise';
import { join } from 'path';

const { stdout, stderr } = process;

run();

async function run() {
  const { version } = require(join(__dirname, '../lerna.json'));
  await runTask(version);
}

async function runTask(version: string) {
  const promise = spawn(
    'yarn',
    [
      'lerna',
      'publish',
      '--skip-npm',
      // '--skip-git', // Uncomment for a dry run
      '--yes',
      '--repo-version',
      version
    ],
    {
      cwd: join(__dirname, '..')
    }
  );
  const { childProcess } = promise;

  childProcess.stdout.on('data', data => {
    stdout.write(data);
  });

  childProcess.stderr.on('data', data => {
    stderr.write(data);
  });

  return promise;
}
