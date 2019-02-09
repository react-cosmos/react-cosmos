import * as io from 'socket.io-client';
import { PluginContext, createPlugin } from 'react-plugin';
import {
  RendererRequest,
  RendererResponse,
  RENDERER_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/renderer';
import { RendererCoreSpec } from '../RendererCore/public';
import { RendererRemoteSpec } from './public';

type Context = PluginContext<RendererRemoteSpec>;

const { onLoad, on, register } = createPlugin<RendererRemoteSpec>({
  name: 'rendererRemote'
});

let socket: void | SocketIOClient.Socket;

function postMessage(msg: RendererRequest) {
  if (socket) {
    socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
  }
}

on<RendererCoreSpec>('rendererCore', {
  request: (context: Context, msg: RendererRequest) => {
    postMessage(msg);
  }
});

onLoad(({ getMethodsOf }: Context) => {
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');

  if (!rendererCore.remoteRenderersEnabled()) {
    return;
  }

  function handleMessage(msg: {}) {
    // TODO: Validate message payload
    rendererCore.receiveResponse(msg as RendererResponse);
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
});

export { register };
