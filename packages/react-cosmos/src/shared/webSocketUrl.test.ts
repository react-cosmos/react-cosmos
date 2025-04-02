import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { getWebSocketUrl } from './webSocketUrl.js';

vi.mock('os', () => ({
  networkInterfaces: vitest.fn(() => ({
    en0: [
      {
        address: '192.168.1.10',
        netmask: '255.255.255.0',
        family: 'IPv4',
        mac: '00:00:00:00:00:00',
        internal: false,
        cidr: '192.168.1.10/24',
      },
    ],
  })),
}));

it('web socket URL starts with ws: protocol', async () => {
  const config = createCosmosConfig(process.cwd());
  const url = getWebSocketUrl(config);
  expect(url.startsWith('ws://')).toBe(true);
});

it('web socket URL starts with wss: protocol', async () => {
  const config = createCosmosConfig(process.cwd(), { https: true });
  const url = getWebSocketUrl(config);
  expect(url.startsWith('wss://')).toBe(true);
});

it('web socket URL includes default port', async () => {
  const config = createCosmosConfig(process.cwd());
  const url = getWebSocketUrl(config);
  expect(url.endsWith(':5000')).toBe(true);
});

it('web socket URL includes custom port', async () => {
  const config = createCosmosConfig(process.cwd(), { port: 5050 });
  const url = getWebSocketUrl(config);
  expect(url.endsWith(':5050')).toBe(true);
});

it('web socket URL includes server IP address', async () => {
  const config = createCosmosConfig(process.cwd());
  const url = getWebSocketUrl(config);
  expect(url).toBe('ws://192.168.1.10:5000');
});

it('web socket URL includes custom host', async () => {
  const config = createCosmosConfig(process.cwd(), { host: '192.168.0.1' });
  const url = getWebSocketUrl(config);
  expect(url).toBe('ws://192.168.0.1:5000');
});
