import io from 'socket.io-client';
import {
  RENDERER_MESSAGE_EVENT_NAME,
  RendererConnect
} from 'react-cosmos-shared2/renderer';

export function createWebSocketsConnect(url: string): RendererConnect {
  const socket = io(url);

  return {
    postMessage(msg) {
      socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    },

    onMessage(onMessage) {
      socket.on(RENDERER_MESSAGE_EVENT_NAME, onMessage);
      return () => socket.off(RENDERER_MESSAGE_EVENT_NAME, onMessage);
    }
  };
}
