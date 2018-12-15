// @flow

import io from 'socket.io-client';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import { registerPlugin } from 'react-plugin';

import type { Socket } from 'socket.io-client';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';

export function register() {
  const { init, on } = registerPlugin({ name: 'rendererRemote' });

  let socket: void | Socket;

  function postMessage(msg: RendererRequest) {
    if (socket) {
      socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    }
  }

  on('renderer.request', (context, msg: RendererRequest) => {
    postMessage(msg);
  });

  init(({ getConfigOf, callMethod }) => {
    if (!getConfigOf('renderer').enableRemote) {
      return;
    }

    function handleMessage(msg: Object) {
      // TODO: Validate message payload
      callMethod('renderer.receiveResponse', msg);
    }

    socket = io();
    socket.on(RENDERER_MESSAGE_EVENT_NAME, handleMessage);

    // Discover remote renderers by asking all to share their fixture list
    postMessage({
      type: 'requestFixtureList'
    });

    return () => {
      if (socket) {
        socket.off(RENDERER_MESSAGE_EVENT_NAME, handleMessage);
        socket = undefined;
      }
    };
  });
}
