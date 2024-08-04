// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import fs from 'node:fs/promises';
import path from 'node:path';
import { getStaticPath } from '../../shared/staticPath.js';
import { ensureFile } from '../../testHelpers/ensureFile.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { pkgPath } from '../../testHelpers/pkgPath.js';
import { viteWorkerId } from '../../testHelpers/viteUtils.js';
import { generateExport } from '../generateExport.js';

const port = 5000 + viteWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const exportPath = path.join(testFsPath, `export-${viteWorkerId()}`);

beforeAll(async () => {
  await ensureFile(pkgPath('react-cosmos-ui/dist/playground.bundle.js'));
  await ensureFile(pkgPath('react-cosmos-ui/dist/playground.bundle.js.map'));
});

beforeEach(async () => {
  await mockCliArgs({});
  await mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port,
    exportPath,
    rendererUrl: '/_renderer.html',
  });
  await mockCosmosPlugins([]);
});

afterEach(async () => {
  await unmockCliArgs();
  await resetFsMock();
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
            rendererUrl: '/_renderer.html',
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

    await checkExportFile('playground.bundle.js');
    await checkExportFile('playground.bundle.js.map');
  });
});

it('generates favicon', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    expect(await readExportFile('_cosmos.ico')).toBe(
      await fs.readFile(getStaticPath('favicon.ico'), 'utf8')
    );
  });
});

async function checkExportFile(filePath: string) {
  return fs.access(path.join(exportPath, filePath));
}

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
