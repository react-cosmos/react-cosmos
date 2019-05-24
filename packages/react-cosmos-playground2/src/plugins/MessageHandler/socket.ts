import io from 'socket.io-client';
import { Message } from 'react-cosmos-shared2/util';
import { SERVER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/build';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import { CoreSpec } from '../Core/public';
import { Context } from './shared';

let socket: void | SocketIOClient.Socket;

export function initSocket(context: Context) {
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

  function handleServerMessage(msg: Message) {
    context.emit('serverMessage', msg);
  }

  function handleRendererMessage(msg: Message) {
    context.emit('rendererResponse', msg);
  }
}

export function postRendererRequest(context: Context, msg: Message) {
  if (socket) {
    socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
  }
}
