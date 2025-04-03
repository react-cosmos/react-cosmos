import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import '../testHelpers/mockOsNetworkInterfaces.js';
import { getRemoteRendererUrl } from './remoteRendererUrl.js';

describe('default host', () => {
  it('adds server host to relative renderer path', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'renderer.html',
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.10:5000/renderer.html'
    );
  });

  it('adds server host to ./ relative renderer path', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: './renderer.html',
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.10:5000/renderer.html'
    );
  });

  it('adds server host to absolute renderer path', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: '/renderer.html',
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.10:5000/renderer.html'
    );
  });

  it('adds server host to absolute renderer path (https)', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: '/renderer.html',
      https: true,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'https://192.168.1.10:5000/renderer.html'
    );
  });

  it('adds server host in full renderer URL', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'http://localhost:5050/renderer.html',
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.10:5050/renderer.html'
    );
  });

  it('adds server host in full renderer URL (https)', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'https://localhost:5050/renderer.html',
      https: true,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'https://192.168.1.10:5050/renderer.html'
    );
  });

  it('adds server host in full renderer URL with fixture var', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'http://localhost:3000/cosmos/<fixture>',
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.10:3000/cosmos/index'
    );
  });
});

describe('custom host', () => {
  it('adds custom host to relative renderer path', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'renderer.html',
      host: '192.168.1.20',
      port: 5001,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.20:5001/renderer.html'
    );
  });

  it('adds custom host to ./ relative renderer path', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: './renderer.html',
      host: '192.168.1.20',
      port: 5001,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.20:5001/renderer.html'
    );
  });

  it('adds custom host to absolute renderer path', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: '/renderer.html',
      host: '192.168.1.20',
      port: 5001,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.20:5001/renderer.html'
    );
  });

  it('adds custom host to absolute renderer path (https)', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: '/renderer.html',
      host: '192.168.1.20',
      port: 5001,
      https: true,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'https://192.168.1.20:5001/renderer.html'
    );
  });

  it('adds custom host in full renderer URL', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'http://localhost:5050/renderer.html',
      host: '192.168.1.20',
      port: 5001,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.20:5050/renderer.html'
    );
  });

  it('adds custom host in full renderer URL (https)', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'https://localhost:5050/renderer.html',
      host: '192.168.1.20',
      port: 5001,
      https: true,
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'https://192.168.1.20:5050/renderer.html'
    );
  });

  it('adds custom host in full renderer URL with fixture var', async () => {
    const config = createCosmosConfig(process.cwd(), {
      rendererUrl: 'http://localhost:3000/cosmos/<fixture>',
      host: '192.168.1.20',
    });
    expect(getRemoteRendererUrl(config)).toBe(
      'http://192.168.1.20:3000/cosmos/index'
    );
  });
});
