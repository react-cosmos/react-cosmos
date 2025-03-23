import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { getWebSocketUrl } from './webSocketUrl.js';

it('web socket URL starts with ws: protocol', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  const url = getWebSocketUrl(cosmosConfig);
  expect(url.startsWith('ws://')).toBe(true);
});

it('web socket URL starts with wss: protocol', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), { https: true });
  const url = getWebSocketUrl(cosmosConfig);
  expect(url.startsWith('wss://')).toBe(true);
});

it('web socket URL includes default port', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  const url = getWebSocketUrl(cosmosConfig);
  expect(url.endsWith(':5000')).toBe(true);
});

it('web socket URL includes custom port', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), { port: 5050 });
  const url = getWebSocketUrl(cosmosConfig);
  expect(url.endsWith(':5050')).toBe(true);
});

it('web socket URL includes custom host', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    hostname: '192.168.0.1',
  });
  const url = getWebSocketUrl(cosmosConfig);
  expect(url).toBe('ws://192.168.0.1:5000');
});
