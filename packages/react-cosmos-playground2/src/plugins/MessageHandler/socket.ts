import io from 'socket.io-client';
import {
  BUILD_MESSAGE_EVENT_NAME,
  BuildMessage
} from 'react-cosmos-shared2/build';
import {
  RendererRequest,
  RendererResponse,
  RENDERER_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/renderer';
import { CoreSpec } from '../Core/public';
import { Context } from './shared';

let socket: void | SocketIOClient.Socket;

export function initSocket(context: Context) {
  const core = context.getMethodsOf<CoreSpec>('core');
  if (!core.isDevServerOn()) {
    return;
  }

  socket = io();
  socket.on(BUILD_MESSAGE_EVENT_NAME, handleBuildMessage);
  socket.on(RENDERER_MESSAGE_EVENT_NAME, handleRendererMessage);

  return () => {
    if (socket) {
      socket.off(BUILD_MESSAGE_EVENT_NAME, handleBuildMessage);
      socket.off(RENDERER_MESSAGE_EVENT_NAME, handleRendererMessage);
      socket = undefined;
    }
  };

  function handleBuildMessage(msg: BuildMessage) {
    context.emit('buildMessage', msg);
  }

  function handleRendererMessage(msg: RendererResponse) {
    context.emit('rendererResponse', msg);
  }
}

export function postRendererRequest(context: Context, msg: RendererRequest) {
  if (socket) {
    socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
  }
}
