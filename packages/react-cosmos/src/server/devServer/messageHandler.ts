import http from 'http';
import { ServerMessage, serverSocketMessage } from 'react-cosmos-core';
import WebSocket, { WebSocketServer } from 'ws';

export function createMessageHandler() {
  let _wss: WebSocketServer | void;

  function startListening(httpServer: http.Server) {
    _wss = new WebSocketServer({ server: httpServer });

    _wss.on('connection', ws => {
      // Forward commands between connected clients. Parties involved can be the
      // - The Cosmos UI, which acts as a remote control
      // - The web iframe or the React Native component renderers
      ws.on('message', msg => {
        if (_wss) {
          _wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(msg.toString());
            }
          });
        }
      });
    });
  }

  function sendMessage(msg: ServerMessage) {
    if (_wss) {
      _wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(serverSocketMessage(msg)));
        }
      });
    }
  }

  function cleanUp() {
    if (_wss) {
      _wss.clients.forEach(client => client.close());
      _wss.close();
    }
  }

  return { startListening, sendMessage, cleanUp };
}
