// @flow

import debug from 'debug';
import socketIo from 'socket.io';

const d = debug('cosmos:server:socket');

export function attachSockets(server: net$Server) {
  d('init');
  const io = socketIo(server);

  io.on('connection', socket => {
    d('connection');
    // Forward commands between connected clients. Parties involved can be the
    // - The Cosmos UI, which acts as a remote control
    // - The web iframe or the React Native component loaders
    socket.on('cosmos-cmd', msg => {
      d('command %o', msg);
      socket.broadcast.emit('cosmos-cmd', msg);
    });
  });

  return () => {
    const { sockets } = io.sockets;
    Object.keys(sockets).forEach(id => {
      sockets[id].disconnect(true);
    });
  };
}
