import http from 'http';
import ioServer from 'socket.io';
import { RENDERER_MESSAGE_EVENT_NAME } from '../../renderer/types';
import { BuildMessage, SERVER_MESSAGE_EVENT_NAME } from '../serverMessage';

export function createMessageHandler(httpServer: http.Server) {
  const io = ioServer(httpServer);

  io.on('connection', socket => {
    // Forward commands between connected clients. Parties involved can be the
    // - The Cosmos UI, which acts as a remote control
    // - The web iframe or the React Native component renderers
    socket.on(RENDERER_MESSAGE_EVENT_NAME, msg => {
      socket.broadcast.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    });
  });

  function sendMessage(msg: BuildMessage) {
    io.emit(SERVER_MESSAGE_EVENT_NAME, msg);
  }

  function cleanUp() {
    const { sockets } = io.sockets;
    Object.keys(sockets).forEach(id => {
      sockets[id].disconnect(true);
    });
  }

  return { sendMessage, cleanUp };
}
