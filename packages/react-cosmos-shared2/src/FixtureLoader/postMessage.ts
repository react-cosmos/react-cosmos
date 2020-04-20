import {
  RendererConnect,
  RendererRequest,
  RendererResponse,
} from '../renderer';
import { registerShortcuts } from '../playground';

export function createPostMessageConnect(): RendererConnect {
  function postMessage(msg: RendererResponse) {
    parent.postMessage(msg, '*');
  }

  return {
    postMessage,

    onMessage(onMessage) {
      function handleMessage(msg: { data: RendererRequest }) {
        onMessage(msg.data);
      }
      window.addEventListener('message', handleMessage, false);

      const removeShortcuts = registerShortcuts(command => {
        postMessage({ type: 'playgroundCommand', payload: { command } });
      });

      return () => {
        window.removeEventListener('message', handleMessage);
        removeShortcuts();
      };
    },
  };
}
