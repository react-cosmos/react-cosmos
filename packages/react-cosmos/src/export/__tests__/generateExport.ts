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

mockCosmosPlugins([]);

const port = 5000 + jestWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const exportPath = path.join(testFsPath, `export-${jestWorkerId()}`);

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port,
    exportPath,
  });
});

afterEach(async () => {
  unmockCliArgs();
  resetFsMock();
  await fs.rm(exportPath, { recursive: true, force: true });
});

it('generates playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    const html = await readExportFile('index.html');

    expect(html).toContain('<title>React Cosmos</title>');
    expect(html).toContain('<script src="playground.bundle.js"></script>');

    expect(html).toContain(
      JSON.stringify({
        playgroundConfig: {
          core: {
            projectId: 'react-cosmos',
            fixturesDir: '__fixtures__',
            fixtureFileSuffix: 'fixture',
            devServerOn: false,
          },
          rendererCore: {
            fixtures: {},
            webRendererUrl: '/_renderer.html',
          },
        },
        pluginConfigs: [],
      })
    );
  });
});

it('generates playground JS', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    const bundle = await readExportFile('playground.bundle.js');
    expect(bundle.trim()).toBe('__mock_bundle__');

    const sourceMap = await readExportFile('playground.bundle.js.map');
    expect(sourceMap.trim()).toBe('__mock_map__');
  });
});

it('generates favicon', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    expect(await readExportFile('_cosmos.ico')).toBe(
      await fs.readFile(
        path.join(__dirname, '../../static/favicon.ico'),
        'utf8'
      )
    );
  });
});

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
