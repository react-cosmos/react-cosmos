import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { getWebSocketUrl } from './webSocketUrl.js';

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

it('web socket URL includes IP address', async () => {
  const config = createCosmosConfig(process.cwd());
  const url = getWebSocketUrl(config);
  expect(url).toMatch(new RegExp('^ws://([0-9.]+):5000$'));
});

it('web socket URL includes custom host', async () => {
  const config = createCosmosConfig(process.cwd(), { host: '192.168.0.1' });
  const url = getWebSocketUrl(config);
  expect(url).toBe('ws://192.168.0.1:5000');
});
