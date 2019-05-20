import http from 'http';
import debug from 'debug';
import ioServer from 'socket.io';
import {
  BuildMessage,
  BUILD_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/build';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';

const d = debug('cosmos:message');

export function createMessageHandler(httpServer: http.Server) {
  d('init');
  const io = ioServer(httpServer);

  io.on('connection', socket => {
    d('connection');
    // Forward commands between connected clients. Parties involved can be the
    // - The Cosmos UI, which acts as a remote control
    // - The web iframe or the React Native component renderers
    socket.on(RENDERER_MESSAGE_EVENT_NAME, msg => {
      d('on renderer message %o', msg);
      socket.broadcast.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    });
  });

  function sendBuildMessage(msg: BuildMessage) {
    d('send build message %o', msg);
    io.emit(BUILD_MESSAGE_EVENT_NAME, msg);
  }

  function cleanUp() {
    const { sockets } = io.sockets;
    Object.keys(sockets).forEach(id => {
      sockets[id].disconnect(true);
    });
  }

  return { sendBuildMessage, cleanUp };
}
