import io from 'socket.io-client';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import {
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { RendererConnect } from '../shared';

export function createWebSocketsConnect(url: string): RendererConnect {
  const socket = io(url);

  return {
    postMessage(msg: RendererResponse) {
      socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
    },

    onMessage(onMessage: OnRendererRequest) {
      socket.on(RENDERER_MESSAGE_EVENT_NAME, onMessage);
      return () => socket.off(RENDERER_MESSAGE_EVENT_NAME, onMessage);
    }
  };
}
