import path from 'node:path';
import type { CosmosConfigInput } from 'react-cosmos';
import { createCosmosConfig } from 'react-cosmos';
import type { CosmosMode } from 'react-cosmos-core';
import { viteConfigPlugin } from './viteConfigPlugin.js';

const rootDir = path.resolve('/project');

async function getRendererUrl(
  mode: CosmosMode,
  configInput: CosmosConfigInput
) {
  const config = createCosmosConfig(rootDir, configInput);
  const newConfig = await viteConfigPlugin({ config, mode, platform: 'web' });
  return newConfig.rendererUrl;
}

describe('dev', () => {
  it('serves renderer from the Cosmos server by default', async () => {
    expect(await getRendererUrl('dev', {})).toBe('renderer.html');
  });

  it('serves renderer from the public URL', async () => {
    const rendererUrl = await getRendererUrl('dev', { publicUrl: '/foo/' });
    expect(rendererUrl).toBe(path.join('/foo/', 'renderer.html'));
  });

  it('serves renderer from its own server when a port is set', async () => {
    const rendererUrl = await getRendererUrl('dev', { vite: { port: 5050 } });
    expect(rendererUrl).toBe('http://localhost:5050');
  });

  it('serves renderer from its own HTTPS server', async () => {
    const rendererUrl = await getRendererUrl('dev', {
      https: true,
      vite: { port: 5050 },
    });
    expect(rendererUrl).toBe('https://localhost:5050');
  });

  it('keeps user renderer URL', async () => {
    const rendererUrl = await getRendererUrl('dev', {
      rendererUrl: 'http://localhost:8080',
      vite: { port: 5050 },
    });
    expect(rendererUrl).toBe('http://localhost:8080');
  });
});

describe('export', () => {
  it('exports renderer next to the Cosmos UI', async () => {
    expect(await getRendererUrl('export', {})).toBe('renderer.html');
  });

  it('exports renderer next to the Cosmos UI when a port is set', async () => {
    const rendererUrl = await getRendererUrl('export', {
      vite: { port: 5050 },
    });
    expect(rendererUrl).toBe('renderer.html');
  });

  it('keeps user renderer URL', async () => {
    const rendererUrl = await getRendererUrl('export', {
      rendererUrl: { dev: 'http://localhost:8080', export: '/renderer' },
    });
    expect(rendererUrl).toEqual({
      dev: 'http://localhost:8080',
      export: '/renderer',
    });
  });
});
