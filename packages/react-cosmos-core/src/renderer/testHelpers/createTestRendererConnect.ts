import { act } from 'react-test-renderer';
import {
  RendererConnect,
  RendererRequest,
  RendererResponse,
} from '../types.js';

type Args = {
  onRendererResponse: (msg: RendererResponse) => unknown;
};
export function createTestRendererConnect({ onRendererResponse }: Args) {
  let messageHandlers: ((msg: RendererRequest) => unknown)[] = [];

  const rendererConnect: RendererConnect = {
    postMessage(rendererResponse) {
      onRendererResponse(rendererResponse);
    },

    onMessage(onMessage) {
      messageHandlers = [...messageHandlers, onMessage];
      return () => {
        messageHandlers = messageHandlers.filter(
          handler => handler !== onMessage
        );
      };
    },
  };

  function postRendererRequest(rendererRequest: RendererRequest) {
    act(() => {
      messageHandlers.forEach(handler => {
        handler(rendererRequest);
      });
    });
  }

  return { rendererConnect, postRendererRequest };
}
