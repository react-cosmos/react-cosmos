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
      'version',
      version,
      // Uncomment for a dry run
      // '--no-git-tag-version',
      // '--no-push',
      '--yes'
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
