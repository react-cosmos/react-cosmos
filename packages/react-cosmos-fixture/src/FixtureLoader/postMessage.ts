import {
  RendererRequest,
  OnRendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { RendererConnect } from '../shared';

export function createPostMessageConnect(): RendererConnect {
  return {
    postMessage(msg: RendererResponse) {
      parent.postMessage(msg, '*');
    },

    onMessage(onMessage: OnRendererRequest) {
      function handleMessage(msg: { data: RendererRequest }) {
        onMessage(msg.data);
      }
      window.addEventListener('message', handleMessage, false);
      return () => window.removeEventListener('message', handleMessage);
    }
  };
}
