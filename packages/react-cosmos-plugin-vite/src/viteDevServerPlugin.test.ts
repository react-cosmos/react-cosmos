import fs from 'node:fs/promises';
import http from 'node:http';
import type net from 'node:net';
import path from 'node:path';
import express from 'express';
import type { CosmosConfigInput } from 'react-cosmos';
import { createCosmosConfig } from 'react-cosmos';
import { vi } from 'vitest';
import WebSocket, { WebSocketServer } from 'ws';
import { viteConfigPlugin } from './viteConfigPlugin.js';
import { viteDevServerPlugin } from './viteDevServerPlugin.js';

const testFsDir = path.join(__dirname, '__testFs__');
const workerId = process.env.VITEST_WORKER_ID ?? '1';

let projectCount = 0;
const cleanups: (() => Promise<unknown>)[] = [];

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(async () => {
  vi.restoreAllMocks();
  for (const cleanup of cleanups.splice(0).reverse()) await cleanup();
});

// A minimal Vite project with a fixture that can be told apart from the
// fixtures of other projects
async function createProject(marker: string, viteConfig = '') {
  const rootDir = path.join(
    testFsDir,
    `devServer-${workerId}-${++projectCount}`
  );
  cleanups.push(() => fs.rm(rootDir, { recursive: true, force: true }));

  await fs.mkdir(path.join(rootDir, 'src'), { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(rootDir, 'index.html'),
      `<!doctype html><html><head></head><body><script type="module" src="/src/main.tsx"></script></body></html>`
    ),
    fs.writeFile(
      path.join(rootDir, 'src/Marker.fixture.ts'),
      `export default '${marker}';`
    ),
    fs.writeFile(
      path.join(rootDir, 'vite.config.js'),
      `export default {
        cacheDir: './.vite',
        logLevel: 'silent',
        optimizeDeps: { noDiscovery: true },
        ${viteConfig}
      };`
    ),
  ]);

  return rootDir;
}

// What the Cosmos dev server does with a server plugin, minus Cosmos itself
async function createCosmosServer(
  rootDir: string,
  configInput: CosmosConfigInput = {}
) {
  const app = express();
  const httpServer = http.createServer(app);
  await new Promise<void>(resolve => httpServer.listen(0, resolve));
  cleanups.push(() => {
    httpServer.closeAllConnections();
    return new Promise(resolve => httpServer.close(resolve));
  });

  const { port } = httpServer.address() as net.AddressInfo;
  const config = await viteConfigPlugin({
    config: createCosmosConfig(rootDir, { ...configInput, port }),
    mode: 'dev',
    platform: 'web',
  });

  function startPlugin() {
    return viteDevServerPlugin({
      config,
      platform: 'web',
      httpServer,
      app,
      sendMessage: () => {},
    });
  }

  return {
    app,
    httpServer,
    port,
    url: `http://localhost:${port}`,
    startPlugin,
  };
}

async function startCosmosServer(
  rootDir: string,
  configInput: CosmosConfigInput = {}
) {
  const server = await createCosmosServer(rootDir, configInput);
  const stopPlugin = await server.startPlugin();
  if (!stopPlugin) throw new Error('Plugin cleanup callback missing');

  let stopped = false;
  async function stop() {
    if (!stopped) {
      stopped = true;
      await stopPlugin!();
    }
  }
  cleanups.push(stop);

  return { ...server, stop };
}

async function fetchText(
  url: string
): Promise<{ status: number; text: string }> {
  const res = await fetch(url);
  const text = await res.text();
  // Vite answers with 504 while it's getting its dependency cache ready, which
  // browsers respond to by reloading the page
  if (res.status === 504) return fetchText(url);
  return { status: res.status, text };
}

async function findFreePort() {
  const server = http.createServer();
  await new Promise<void>(resolve => server.listen(0, resolve));
  const { port } = server.address() as net.AddressInfo;
  await new Promise(resolve => server.close(resolve));
  return port;
}

describe('renderer served by the Cosmos server', () => {
  it('serves renderer HTML', async () => {
    const { url } = await startCosmosServer(await createProject('one'));

    const { status, text } = await fetchText(`${url}/renderer.html`);
    expect(status).toBe(200);
    expect(text).toContain('<script type="module" src="/@vite/client">');
    expect(text).toContain('<script type="module" src="/src/main.tsx">');

    const head = await fetch(`${url}/renderer.html`, { method: 'HEAD' });
    expect(head.status).toBe(200);
  });

  it('serves renderer modules', async () => {
    const { url, port } = await startCosmosServer(await createProject('one'));

    const main = await fetchText(`${url}/src/main.tsx`);
    expect(main.status).toBe(200);
    expect(main.text).toContain('mountDomRenderer');

    const imports = await fetchText(`${url}/@id/__x00__virtual:cosmos-imports`);
    expect(imports.text).toContain('src/Marker.fixture.ts');
    // The renderer connects to the port the Cosmos server is listening on
    expect(imports.text).toMatch(new RegExp(`"ws://[^"]+:${port}"`));

    const fixture = await fetchText(`${url}/src/Marker.fixture.ts`);
    expect(fixture.text).toContain('one');
  });

  it('serves renderer from the public URL', async () => {
    const rootDir = await createProject('one');
    const { url } = await startCosmosServer(rootDir, { publicUrl: '/foo/' });

    const { status, text } = await fetchText(`${url}/foo/renderer.html`);
    expect(status).toBe(200);
    expect(text).toContain('<script type="module" src="/foo/src/main.tsx">');

    const main = await fetchText(`${url}/foo/src/main.tsx`);
    expect(main.text).toContain('mountDomRenderer');
  });

  it('serves renderer from a custom path', async () => {
    const rootDir = await createProject('one');
    const { url } = await startCosmosServer(rootDir, {
      rendererUrl: '/preview/renderer',
    });

    const { status, text } = await fetchText(`${url}/preview/renderer`);
    expect(status).toBe(200);
    expect(text).toContain('<script type="module" src="/src/main.tsx">');

    expect((await fetchText(`${url}/renderer.html`)).status).toBe(404);
  });

  it('holds renderer requests until Vite is ready', async () => {
    const { url, startPlugin } = await createCosmosServer(
      await createProject('one')
    );

    const pluginStarted = startPlugin();
    const res = await fetchText(`${url}/renderer.html`);
    cleanups.push(async () => (await pluginStarted)!());

    expect(res.status).toBe(200);
    expect(res.text).toContain('<script type="module" src="/src/main.tsx">');
  });

  it('passes on requests that are not for the renderer', async () => {
    const { url, app } = await startCosmosServer(await createProject('one'));
    app.get('/_other-plugin', (_, res) => {
      res.send('Other plugin');
    });

    expect((await fetchText(`${url}/_other-plugin`)).text).toBe('Other plugin');
    // The Cosmos UI lives at the server root, not the user's index.html
    expect((await fetchText(url)).status).toBe(404);
    expect((await fetchText(`${url}/index.html`)).status).toBe(404);
  });

  it('runs hot reloading socket on the Cosmos server', async () => {
    const { url, port } = await startCosmosServer(await createProject('one'));

    const client = await fetchText(`${url}/@vite/client`);
    const [, token] = client.text.match(/const wsToken = "(.+)";/)!;
    // No separate socket port for the client to connect to
    expect(client.text).toContain('const hmrPort = null;');

    const socket = new WebSocket(
      `ws://localhost:${port}/?token=${token}`,
      'vite-hmr',
      { origin: url }
    );
    try {
      const message = await new Promise((resolve, reject) => {
        socket.once('message', msg => resolve(JSON.parse(msg.toString())));
        socket.once('error', reject);
      });
      expect(message).toEqual({ type: 'connected' });
    } finally {
      socket.terminate();
    }
  });

  it('proxies sockets from the Vite config through the Cosmos server', async () => {
    const backend = new WebSocketServer({ port: 0 });
    cleanups.push(() => new Promise(resolve => backend.close(resolve)));
    backend.on('connection', socket => socket.send('backend'));
    await new Promise(resolve => backend.once('listening', resolve));
    const backendPort = (backend.address() as net.AddressInfo).port;

    const rootDir = await createProject(
      'one',
      `server: {
        proxy: {
          '/socket': { target: 'ws://localhost:${backendPort}', ws: true },
        },
      },`
    );
    const { port } = await startCosmosServer(rootDir);

    const socket = new WebSocket(`ws://localhost:${port}/socket`);
    try {
      const message = await new Promise((resolve, reject) => {
        socket.once('message', msg => resolve(msg.toString()));
        socket.once('error', reject);
      });
      expect(message).toBe('backend');
    } finally {
      socket.terminate();
    }
  });

  it('serves each project its own code when started at the same time', async () => {
    const rootDirs = await Promise.all([
      createProject('one'),
      createProject('two'),
    ]);
    const [server1, server2] = await Promise.all(
      rootDirs.map(rootDir => startCosmosServer(rootDir))
    );

    const fixturePath = '/src/Marker.fixture.ts';
    expect((await fetchText(server1.url + fixturePath)).text).toContain('one');
    expect((await fetchText(server2.url + fixturePath)).text).toContain('two');
  });

  it('detaches from the Cosmos server on cleanup', async () => {
    const { httpServer, stop } = await startCosmosServer(
      await createProject('one')
    );
    expect(httpServer.listenerCount('upgrade')).toBe(1);

    await stop();
    expect(httpServer.listenerCount('upgrade')).toBe(0);
  });
});

describe('renderer served by its own server', () => {
  it('serves renderer on the Vite port', async () => {
    const port = await findFreePort();
    const { url } = await startCosmosServer(await createProject('one'), {
      vite: { port },
    });

    const { status, text } = await fetchText(`http://localhost:${port}`);
    expect(status).toBe(200);
    expect(text).toContain('<script type="module" src="/src/main.tsx">');

    expect((await fetchText(`${url}/renderer.html`)).status).toBe(404);
  });

  it('fails when the Vite port is taken', async () => {
    const port = await findFreePort();
    await startCosmosServer(await createProject('one'), { vite: { port } });

    const server2 = await createCosmosServer(await createProject('two'), {
      vite: { port },
    });
    await expect(server2.startPlugin()).rejects.toThrow(
      `Port ${port} is already in use`
    );

    // The first renderer is still the one answering
    const fixture = await fetchText(
      `http://localhost:${port}/src/Marker.fixture.ts`
    );
    expect(fixture.text).toContain('one');
  });

  it('frees the Vite port on cleanup', async () => {
    const port = await findFreePort();
    const { stop } = await startCosmosServer(await createProject('one'), {
      vite: { port },
    });

    await stop();
    await expect(fetch(`http://localhost:${port}`)).rejects.toThrow();
  });
});

it('does nothing on native platform', async () => {
  const rootDir = await createProject('one');
  const cleanup = await viteDevServerPlugin({
    config: createCosmosConfig(rootDir),
    platform: 'native',
    httpServer: http.createServer(),
    app: express(),
    sendMessage: () => {},
  });
  expect(cleanup).toBeUndefined();
});
