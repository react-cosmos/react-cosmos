import path from 'node:path';
import { createCosmosConfig } from 'react-cosmos';
import { mockConsole } from 'react-cosmos/vitest.js';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import {
  reactCosmosViteRollupPlugin,
  userImportsResolvedModuleId,
} from './reactCosmosViteRollupPlugin.js';

type Hook = (...args: unknown[]) => unknown;

const rootDir = path.resolve('/project');
const fixturePath = path.join(rootDir, 'src/Button.fixture.tsx');
const userImportsModule = { id: userImportsResolvedModuleId };

function createServer(module: object | undefined) {
  return {
    moduleGraph: {
      getModuleById: vi.fn(() => module),
      invalidateModule: vi.fn(),
    },
    reloadModule: vi.fn(),
  };
}

async function createPlugin() {
  const config = createCosmosConfig(rootDir);
  const cosmosViteConfig = await mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] No Vite config found, using default settings');
    return createCosmosViteConfig(config);
  });
  return reactCosmosViteRollupPlugin(config, cosmosViteConfig, 'dev');
}

async function startPlugin(server?: ReturnType<typeof createServer>) {
  const plugin = await createPlugin();
  if (server) (plugin.configureServer as Hook)(server);
  return (id: string, event: string) =>
    (plugin.watchChange as Hook)(id, { event });
}

it('reloads user imports when a fixture is created', async () => {
  const server = createServer(userImportsModule);
  const watchChange = await startPlugin(server);
  await watchChange(fixturePath, 'create');
  expect(server.moduleGraph.invalidateModule).toHaveBeenCalledWith(
    userImportsModule
  );
  expect(server.reloadModule).toHaveBeenCalledWith(userImportsModule);
});

it('reloads user imports when a fixture is deleted', async () => {
  const server = createServer(userImportsModule);
  const watchChange = await startPlugin(server);
  await watchChange(fixturePath, 'delete');
  expect(server.reloadModule).toHaveBeenCalledWith(userImportsModule);
});

it("doesn't reload user imports when a fixture is updated", async () => {
  const server = createServer(userImportsModule);
  const watchChange = await startPlugin(server);
  await watchChange(fixturePath, 'update');
  expect(server.reloadModule).not.toHaveBeenCalled();
});

it("doesn't reload user imports when a non-fixture file is created", async () => {
  const server = createServer(userImportsModule);
  const watchChange = await startPlugin(server);
  await watchChange(path.join(rootDir, 'src/Button.tsx'), 'create');
  expect(server.reloadModule).not.toHaveBeenCalled();
});

it("doesn't reload user imports before they're loaded", async () => {
  const server = createServer(undefined);
  const watchChange = await startPlugin(server);
  await watchChange(fixturePath, 'create');
  expect(server.reloadModule).not.toHaveBeenCalled();
});

it('does nothing without a dev server', async () => {
  const watchChange = await startPlugin();
  await expect(watchChange(fixturePath, 'create')).resolves.toBeUndefined();
});

describe('hot update', () => {
  async function hotUpdate(type: string, file: string, importerIds: string[]) {
    const plugin = await createPlugin();
    const module = {
      id: file,
      importers: new Set(importerIds.map(id => ({ id }))),
    };
    const result = (plugin.hotUpdate as Hook)({
      type,
      file,
      modules: [module],
    });
    return { module, result };
  }

  it('skips a deleted fixture imported only by user imports', async () => {
    const { result } = await hotUpdate('delete', fixturePath, [
      userImportsResolvedModuleId,
    ]);
    expect(result).toEqual([]);
  });

  it('keeps a deleted fixture that has other importers', async () => {
    const { module, result } = await hotUpdate('delete', fixturePath, [
      userImportsResolvedModuleId,
      path.join(rootDir, 'src/Other.fixture.tsx'),
    ]);
    expect(result).toEqual([module]);
  });

  it("doesn't filter updated fixtures", async () => {
    const { result } = await hotUpdate('update', fixturePath, [
      userImportsResolvedModuleId,
    ]);
    expect(result).toBeUndefined();
  });

  it("doesn't filter deleted non-fixture files", async () => {
    const { result } = await hotUpdate(
      'delete',
      path.join(rootDir, 'src/Button.tsx'),
      [userImportsResolvedModuleId]
    );
    expect(result).toBeUndefined();
  });
});
