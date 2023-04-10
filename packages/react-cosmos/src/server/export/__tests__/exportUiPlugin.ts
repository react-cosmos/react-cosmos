// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import fs from 'node:fs/promises';
import path from 'node:path';
import { generateExport } from '../generateExport.js';

const port = 5000 + jestWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const pluginPath = path.join(testFsPath, `plugin-${jestWorkerId()}`);
const exportPath = path.join(testFsPath, `export-${jestWorkerId()}`);

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: pluginPath,
  ui: path.join(pluginPath, '/ui.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

beforeEach(async () => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port, exportPath });

  await fs.mkdir(testCosmosPlugin.rootDir, { recursive: true });
  await fs.writeFile(testCosmosPlugin.ui, 'export {}', 'utf8');
});

afterEach(async () => {
  unmockCliArgs();
  resetFsMock();
  await fs.rm(pluginPath, { recursive: true, force: true });
  await fs.rm(exportPath, { recursive: true, force: true });
});

it('embeds UI plugin in playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    const html = await readExportFile('index.html');
    expect(html).toContain(
      JSON.stringify([
        {
          name: 'Test Cosmos plugin',
          // Paths are relative to the export directory
          rootDir: `plugin-${jestWorkerId()}`,
          ui: path.join(`plugin-${jestWorkerId()}`, 'ui.js'),
        },
      ])
    );
  });
});

it('copies plugin files to export directory', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    const uiPath = path.join(`_plugin/plugin-${jestWorkerId()}/ui.js`);
    const uiModule = await readExportFile(uiPath);

    expect(uiModule).toBe('export {}');
  });
});

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
