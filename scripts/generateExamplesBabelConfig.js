// @flow

import { join } from 'path';
import { getExamples, writeFileAsync, done } from './shared';

run();

const TEMPLATE = `// Babel picks up configs relative to cwd (current working directory). We need
// this re-export to reuse the global Babel config from the monorepo.
// NOTE: This file is generated automatically to avoid manual labor and
// out-of-sync duplication. See scripts/generateExamplesBabelConfig.js
module.exports = require('../../babel.config');\n`;

async function run() {
  const examplesDir = join(__dirname, '../examples');
  const examples = await getExamples();

  await Promise.all(
    examples.map(async exampleName => {
      const configPath = join(examplesDir, exampleName, 'babel.config.js');
      await writeFileAsync(configPath, TEMPLATE, 'utf8');
    })
  );

  console.log(done(`Generated Babel configs in examples`));
}
