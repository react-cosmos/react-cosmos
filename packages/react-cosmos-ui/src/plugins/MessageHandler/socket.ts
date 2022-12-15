import {
  MessageType,
  rendererSocketMessage,
  SocketMessage,
} from 'react-cosmos-core';
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
      for (const msg of pendingMessages) socket.send(JSON.stringify(msg));
      pendingMessages = [];
    }
  });

  function handleMessage(event: MessageEvent<string>) {
    const message = JSON.parse(event.data) as SocketMessage;
    switch (message.channel) {
      case 'renderer':
        return context.emit('rendererResponse', message.message);
      case 'server':
        return context.emit('serverMessage', message.message);
      default:
        console.log('Unknown socket message', message);
    }
  }
  socket.addEventListener('message', handleMessage);

  return () => {
    if (socket) {
      socket.removeEventListener('message', handleMessage);
      socket.close();
      socket = null;
    }
  };
}

export function postRendererRequest(
  context: MessageHandlerContext,
  msg: MessageType
) {
  const socketMessage = rendererSocketMessage(msg);
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(socketMessage));
  } else {
    pendingMessages.push(socketMessage);
  }
}
