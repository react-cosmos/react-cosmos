import {
  RendererRequest,
  RendererResponse,
  RENDERER_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/renderer';
import * as io from 'socket.io-client';
import { RendererCoreSpec } from '../RendererCore/public';
import { Context } from './shared';

let socket: void | SocketIOClient.Socket;

export function onRendererRequest(context: Context, msg: RendererRequest) {
  postMessage(msg);
}

export function initSocket({ getMethodsOf }: Context) {
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  if (!rendererCore.remoteRenderersEnabled()) {
    return;
  }

  socket = io();
  socket.on(RENDERER_MESSAGE_EVENT_NAME, handleMessage);

  // Discover remote renderers by asking all to announce themselves
  postMessage({
    type: 'pingRenderers'
  });

  return () => {
    if (socket) {
      socket.off(RENDERER_MESSAGE_EVENT_NAME, handleMessage);
      socket = undefined;
    }
  };

  function handleMessage(msg: {}) {
    // TODO: Validate message payload
    rendererCore.receiveResponse(msg as RendererResponse);
  }
}

function postMessage(msg: RendererRequest) {
  if (socket) {
    socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
  }
}
