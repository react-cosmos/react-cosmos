import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { getServerAddress } from './serverAddress.js';

it('server address starts with ws: protocol', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  const serverAddress = getServerAddress(cosmosConfig);
  expect(serverAddress.startsWith('ws://')).toBe(true);
});

it('server address starts with wss: protocol', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), { https: true });
  const serverAddress = getServerAddress(cosmosConfig);
  expect(serverAddress.startsWith('wss://')).toBe(true);
});

it('server address includes default port', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd());
  const serverAddress = getServerAddress(cosmosConfig);
  expect(serverAddress.endsWith(':5000')).toBe(true);
});

it('server address includes custom port', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), { port: 5050 });
  const serverAddress = getServerAddress(cosmosConfig);
  expect(serverAddress.endsWith(':5050')).toBe(true);
});

it('server address includes custom host', async () => {
  const cosmosConfig = createCosmosConfig(process.cwd(), {
    hostname: '192.168.0.1',
  });
  const serverAddress = getServerAddress(cosmosConfig);
  expect(serverAddress).toBe('ws://192.168.0.1:5000');
});
