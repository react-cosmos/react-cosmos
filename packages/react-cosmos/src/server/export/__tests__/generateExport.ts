// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import '../../testHelpers/mockEsmRequire.js';
import { mockResolve } from '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import 'isomorphic-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';
import { generateExport } from '../generateExport.js';

mockCosmosPlugins([]);

const exportPath = path.join(__dirname, `../test-export-${jestWorkerId()}`);

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { exportPath });
});

afterEach(async () => {
  unmockCliArgs();
  resetFsMock();
  await fs.rm(exportPath, { recursive: true, force: true });
});

it('generates export', async () => {
  return mockConsole(async ({ expectLog }) => {
    // These files are mocked because they are only available after all
    // Cosmos packages are built, and tests should run with source code only.
    mockResolve(
      'react-cosmos-ui/dist/playground.bundle.js',
      require.resolve('../../testHelpers/mock.bundle.js.txt')
    );
    mockResolve(
      'react-cosmos-ui/dist/playground.bundle.js.map',
      require.resolve('../../testHelpers/mock.bundle.js.map.txt')
    );

    expectLog('[Cosmos] Export complete!');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    // JS bundle and source map
    expect((await readExportFile('playground.bundle.js')).trim()).toBe(
      '__mock_bundle__'
    );
    expect((await readExportFile('playground.bundle.js.map')).trim()).toBe(
      '__mock_map__'
    );

    // Favicon
    expect(await readExportFile('_cosmos.ico')).toBe(
      await fs.readFile(
        path.join(__dirname, '../../static/favicon.ico'),
        'utf8'
      )
    );

    // Index HTML
    const html = await readExportFile('index.html');

    expect(html).toContain('<title>React Cosmos</title>');
    expect(html).toContain('<script src="playground.bundle.js"></script>');

    expect(html).toContain(
      JSON.stringify({
        playgroundConfig: {
          core: {
            projectId: 'new-project',
            fixturesDir: '__fixtures__',
            fixtureFileSuffix: 'fixture',
            devServerOn: false,
            webRendererUrl: '/_renderer.html',
          },
        },
        pluginConfigs: [],
      })
    );
  });
});

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
