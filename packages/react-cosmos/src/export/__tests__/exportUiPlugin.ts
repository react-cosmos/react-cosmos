// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import fs from 'node:fs/promises';
import path from 'node:path';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { viteWorkerId } from '../../testHelpers/viteUtils.js';
import { generateExport } from '../generateExport.js';

const port = 5000 + viteWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const pluginPath = path.join(testFsPath, `plugin-${viteWorkerId()}`);
const exportPath = path.join(testFsPath, `export-${viteWorkerId()}`);

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: pluginPath,
  ui: path.join(pluginPath, 'ui.js'),
};

beforeEach(async () => {
  await mockCliArgs({});
  await mockCosmosConfig('cosmos.config.json', { port, exportPath });
  await mockCosmosPlugins([testCosmosPlugin]);

  await fs.mkdir(testCosmosPlugin.rootDir, { recursive: true });
  await fs.writeFile(testCosmosPlugin.ui, 'export {}', 'utf8');
});

afterEach(async () => {
  await unmockCliArgs();
  await resetFsMock();
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
          rootDir: `plugin-${viteWorkerId()}`,
          ui: path.join(`plugin-${viteWorkerId()}`, 'ui.js'),
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

    const uiPath = path.join(`_plugin/plugin-${viteWorkerId()}/ui.js`);
    const uiModule = await readExportFile(uiPath);

    expect(uiModule).toBe('export {}');
  });
});

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
