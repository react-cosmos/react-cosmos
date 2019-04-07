import debug from 'debug';
import socketIo from 'socket.io';
import { DevServerPluginArgs } from '../shared';

const d = debug('cosmos:server:socket');

export function socketConnect({ httpServer }: DevServerPluginArgs) {
  d('init');
  const io = socketIo(httpServer);

  io.on('connection', socket => {
    d('connection');
    // Forward commands between connected clients. Parties involved can be the
    // - The Cosmos UI, which acts as a remote control
    // - The web iframe or the React Native component renderers
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
