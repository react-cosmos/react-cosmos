import { MessageType, SocketMessage } from 'react-cosmos-core';
import { CoreSpec } from '../Core/spec.js';
import { MessageHandlerContext } from './shared.js';

let socket: null | WebSocket = null;
let pendingMessages: SocketMessage[] = [];

export function initSocket(context: MessageHandlerContext) {
  const core = context.getMethodsOf<CoreSpec>('core');
  if (!core.isDevServerOn()) {
    return;
  }

  socket = new WebSocket(location.origin.replace(/^https?:/, 'ws:'));

  socket.addEventListener('open', () => {
    if (socket && pendingMessages.length > 0) {
      pendingMessages.forEach(msg => socket!.send(JSON.stringify(msg)));
      pendingMessages = [];
    }
  });

  function handler(event: MessageEvent<string>) {
    const message = JSON.parse(event.data) as SocketMessage;
    switch (message.eventName) {
      case 'renderer':
        return context.emit('rendererResponse', message.body);
      case 'server':
        return context.emit('serverMessage', message.body);
      default:
        console.log('Unknown socket message', message);
    }
  }
  socket.addEventListener('message', handler);

  return () => {
    if (socket) {
      socket.removeEventListener('message', handler);
      socket.close();
      socket = null;
    }
  };
}

export function postRendererRequest(
  context: MessageHandlerContext,
  msg: MessageType
) {
  const message: SocketMessage = {
    eventName: 'renderer',
    body: msg,
  };
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    pendingMessages.push(message);
  }
}
