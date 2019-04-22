import io from 'socket.io-client';
import { RENDERER_MESSAGE_EVENT_NAME } from 'react-cosmos-shared2/renderer';
import {
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { RendererConnect } from '../shared';

export function createWebSocketsConnect(url: string): RendererConnect {
  return (onMessage: OnRendererRequest) => {
    const socket = io(url);
    socket.on(RENDERER_MESSAGE_EVENT_NAME, onMessage);

    return {
      postMessage(msg: RendererResponse) {
        socket.emit(RENDERER_MESSAGE_EVENT_NAME, msg);
      },
      off() {
        socket.off(RENDERER_MESSAGE_EVENT_NAME, onMessage);
      }
    };
  };
}
