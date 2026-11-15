import type http from 'http';
import type { Duplex } from 'stream';
import type { ServerMessage } from 'react-cosmos-core';
import { serverSocketMessage } from 'react-cosmos-core';
import WebSocket, { WebSocketServer } from 'ws';

export function createMessageHandler(httpServer: http.Server) {
  const wss = new WebSocketServer({ noServer: true });

  // Server plugins can run their own sockets on the Cosmos server (eg. Vite's
  // hot reloading), so only Cosmos connections are handled here and all other
  // upgrade requests are left to the plugins' own listeners
  function handleUpgrade(
    req: http.IncomingMessage,
    socket: Duplex,
    head: Buffer
  ) {
    if (isCosmosSocketRequest(req)) {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit('connection', ws, req);
      });
    }
  }
  httpServer.on('upgrade', handleUpgrade);

  wss.on('connection', ws => {
    // Forward commands between connected clients. Parties involved can be the
    // - The Cosmos UI, which acts as a remote control
    // - The web iframe or the React Native component renderers
    ws.on('message', msg => {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg.toString());
        }
      });
    });
  });

  function sendMessage(msg: ServerMessage) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(serverSocketMessage(msg)));
      }
    });
  }

  function close() {
    httpServer.off('upgrade', handleUpgrade);
    wss.clients.forEach(client => client.close());
    wss.close();
  }

  return { sendMessage, close };
}

// The Cosmos UI and the renderers connect to the server root and don't ask for
// a subprotocol
function isCosmosSocketRequest(req: http.IncomingMessage) {
  const pathname = (req.url ?? '/').split('?')[0];
  return pathname === '/' && !req.headers['sec-websocket-protocol'];
}
