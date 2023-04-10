import http from 'http';
import { ServerMessage, serverSocketMessage } from 'react-cosmos-core';
import WebSocket, { WebSocketServer } from 'ws';

export function createMessageHandler(httpServer: http.Server) {
  const wss = new WebSocketServer({ server: httpServer });

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
    wss.clients.forEach(client => client.close());
    wss.close();
  }

  return { sendMessage, close };
}
