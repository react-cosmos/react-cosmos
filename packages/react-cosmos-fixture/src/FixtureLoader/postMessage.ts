import {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { RendererConnect } from '../shared';

export function createPostMessageConnect<
  Request = RendererRequest,
  Response = RendererResponse
>(): RendererConnect<Request, Response> {
  return {
    postMessage(msg) {
      parent.postMessage(msg, '*');
    },

    onMessage(onMessage) {
      function handleMessage(msg: { data: Request }) {
        onMessage(msg.data);
      }
      window.addEventListener('message', handleMessage, false);
      return () => window.removeEventListener('message', handleMessage);
    }
  };
}
