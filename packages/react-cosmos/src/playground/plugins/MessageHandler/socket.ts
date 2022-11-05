import {
  MessageType,
  RENDERER_MESSAGE_EVENT_NAME,
  SERVER_MESSAGE_EVENT_NAME,
} from 'react-cosmos-core';
import io from 'socket.io-client';
import { CoreSpec } from '../Core/spec';
import { MessageHandlerContext } from './shared';

let socket: void | SocketIOClient.Socket;

export function initSocket(context: MessageHandlerContext) {
  const core = context.getMethodsOf<CoreSpec>('core');
  if (!core.isDevServerOn()) {
    return;
  }

  socket = io();
  socket.on(SERVER_MESSAGE_EVENT_NAME, handleServerMessage);
  socket.on(RENDERER_MESSAGE_EVENT_NAME, handleRendererMessage);

  return () => {
    if (socket) {
      socket.off(SERVER_MESSAGE_EVENT_NAME, handleServerMessage);
      socket.off(RENDERER_MESSAGE_EVENT_NAME, handleRendererMessage);
      socket = undefined;
    }
  };

  function handleServerMessage(msg: MessageType) {
    context.emit('serverMessage', msg);
  }

  function handleRendererMessage(msg: MessageType) {
    context.emit('rendererResponse', msg);
  }
}

export function postRendererRequest(
  context: MessageHandlerContext,
  msg: MessageType
) {
  if (socket) {
    socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
  }
}
