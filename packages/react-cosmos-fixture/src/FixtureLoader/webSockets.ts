import io from 'socket.io-client';
import {
  RendererRequest,
  RendererResponse,
  RENDERER_MESSAGE_EVENT_NAME
} from 'react-cosmos-shared2/renderer';
import { RendererConnect } from '../shared';

export function createWebSocketsConnect<
  Request = RendererRequest,
  Response = RendererResponse
>(url: string): RendererConnect<Request, Response> {
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
