import {
  rendererSocketMessage,
  SocketMessage,
} from '../../playground/socketMessage.js';
import { RendererConnect, RendererRequest } from '../types.js';

export function createWebSocketsConnect(url: string): RendererConnect {
  const socket = new WebSocket(url);
  let pendingMessages: SocketMessage[] = [];

  socket.addEventListener('open', () => {
    if (pendingMessages.length > 0) {
      pendingMessages.forEach(msg => socket.send(JSON.stringify(msg)));
      pendingMessages = [];
    }
  });

  return {
    postMessage(rendererResponse) {
      const socketMessage = rendererSocketMessage(rendererResponse);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(socketMessage));
      } else {
        pendingMessages.push(socketMessage);
      }
    },

    onMessage(onMessage) {
      const handler = (msg: MessageEvent<string>) => {
        const socketMessage = JSON.parse(msg.data) as SocketMessage;
        if (socketMessage.eventName === 'renderer') {
          onMessage(socketMessage.body as RendererRequest);
        }
      };
      socket.addEventListener('message', handler);
      return () => socket.removeEventListener('message', handler);
    },
  };
}
