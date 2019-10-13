import { RendererConnect, RendererRequest } from '../renderer';

export function createPostMessageConnect(): RendererConnect {
  return {
    postMessage(msg) {
      parent.postMessage(msg, '*');
    },

    onMessage(onMessage) {
      function handleMessage(msg: { data: RendererRequest }) {
        onMessage(msg.data);
      }
      window.addEventListener('message', handleMessage, false);
      return () => window.removeEventListener('message', handleMessage);
    }
  };
}
