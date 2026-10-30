import path from 'node:path';
import { createCosmosConfig } from 'react-cosmos';
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

function startPlugin(server?: ReturnType<typeof createServer>) {
  const config = createCosmosConfig(rootDir);
  const plugin = reactCosmosViteRollupPlugin(
    config,
    createCosmosViteConfig(config),
    'dev'
  );
  if (server) (plugin.configureServer as Hook)(server);
  return (id: string, event: string) =>
    (plugin.watchChange as Hook)(id, { event });
}

it('reloads user imports when a fixture is created', () => {
  const server = createServer(userImportsModule);
  startPlugin(server)(fixturePath, 'create');
  expect(server.moduleGraph.invalidateModule).toHaveBeenCalledWith(
    userImportsModule
  );
  expect(server.reloadModule).toHaveBeenCalledWith(userImportsModule);
});

it('reloads user imports when a fixture is deleted', () => {
  const server = createServer(userImportsModule);
  startPlugin(server)(fixturePath, 'delete');
  expect(server.reloadModule).toHaveBeenCalledWith(userImportsModule);
});

it("doesn't reload user imports when a fixture is updated", () => {
  const server = createServer(userImportsModule);
  startPlugin(server)(fixturePath, 'update');
  expect(server.reloadModule).not.toHaveBeenCalled();
});

it("doesn't reload user imports when a non-fixture file is created", () => {
  const server = createServer(userImportsModule);
  startPlugin(server)(path.join(rootDir, 'src/Button.tsx'), 'create');
  expect(server.reloadModule).not.toHaveBeenCalled();
});

it("doesn't reload user imports before they're loaded", () => {
  const server = createServer(undefined);
  startPlugin(server)(fixturePath, 'create');
  expect(server.reloadModule).not.toHaveBeenCalled();
});

it('does nothing without a dev server', () => {
  expect(() => startPlugin()(fixturePath, 'create')).not.toThrow();
});
