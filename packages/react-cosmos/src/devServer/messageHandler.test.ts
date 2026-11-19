import http from 'node:http';
import type net from 'node:net';
import retry from '@skidding/async-retry';
import WebSocket, { WebSocketServer } from 'ws';
import { createMessageHandler } from './messageHandler.js';

let httpServer: http.Server;
let msgHandler: ReturnType<typeof createMessageHandler>;
let pluginSocketServer: WebSocketServer;
let url: string;
const clients: WebSocket[] = [];

beforeEach(async () => {
  httpServer = http.createServer();
  msgHandler = createMessageHandler(httpServer);

  // A server plugin running its own socket on the Cosmos server, the way
  // Vite does for hot reloading
  pluginSocketServer = new WebSocketServer({ noServer: true });
  httpServer.on('upgrade', (req, socket, head) => {
    if (req.headers['sec-websocket-protocol'] || req.url !== '/') {
      pluginSocketServer.handleUpgrade(req, socket, head, ws => {
        ws.send('plugin');
      });
    }
  });

  await new Promise<void>(resolve => httpServer.listen(0, resolve));
  url = `ws://localhost:${(httpServer.address() as net.AddressInfo).port}`;
});

afterEach(async () => {
  clients.splice(0).forEach(client => client.terminate());
  msgHandler.close();
  pluginSocketServer.close();
  await new Promise(resolve => httpServer.close(resolve));
});

function connect(socketUrl: string, protocol?: string) {
  const client = new WebSocket(socketUrl, protocol);
  clients.push(client);

  const messages: string[] = [];
  client.on('message', msg => messages.push(msg.toString()));

  const opened = new Promise<void>((resolve, reject) => {
    client.once('open', resolve);
    client.once('error', reject);
  });
  return { client, messages, opened };
}

const serverMessage = JSON.stringify({
  channel: 'server',
  message: { type: 'buildStart' },
});

it('sends server messages to clients connected to the server root', async () => {
  const { messages, opened } = connect(url);
  await opened;

  msgHandler.sendMessage({ type: 'buildStart' });
  await retry(() => expect(messages).toEqual([serverMessage]));
});

it('forwards messages between clients', async () => {
  const client1 = connect(`${url}/`);
  const client2 = connect(url);
  await Promise.all([client1.opened, client2.opened]);

  client1.client.send('hello');
  await retry(() => expect(client2.messages).toEqual(['hello']));
  expect(client1.messages).toEqual([]);
});

it('leaves connections that ask for a subprotocol to other listeners', async () => {
  const { messages, opened } = connect(`${url}/?token=abc`, 'vite-hmr');
  await opened;
  await retry(() => expect(messages).toEqual(['plugin']));

  msgHandler.sendMessage({ type: 'buildStart' });
  const cosmosClient = connect(url);
  await cosmosClient.opened;
  cosmosClient.client.send('hello');

  // The plugin's client isn't part of the Cosmos message exchange
  const witness = connect(url);
  await witness.opened;
  cosmosClient.client.send('are we done');
  await retry(() => expect(witness.messages).toEqual(['are we done']));
  expect(messages).toEqual(['plugin']);
});

it('leaves connections to other paths to other listeners', async () => {
  const { messages, opened } = connect(`${url}/graphql`);
  await opened;
  await retry(() => expect(messages).toEqual(['plugin']));
});

it('stops handling connections once closed', async () => {
  const upgradeListeners = httpServer.listenerCount('upgrade');
  msgHandler.close();
  expect(httpServer.listenerCount('upgrade')).toBe(upgradeListeners - 1);
});
