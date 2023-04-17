import delay from 'delay';
import { act } from 'react-test-renderer';
import {
  RendererConnect,
  RendererRequest,
  RendererResponse,
} from '../rendererConnectTypes.js';

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

  async function postRendererRequest(rendererRequest: RendererRequest) {
    // Simulate async communication between renderer and parent
    await delay(Math.round(Math.random() * 50));
    act(() => {
      messageHandlers.forEach(handler => {
        handler(rendererRequest);
      });
    });
  }

  return { rendererConnect, postRendererRequest };
}
