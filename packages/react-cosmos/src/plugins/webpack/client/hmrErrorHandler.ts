import {
  RendererRequest,
  RendererConnect
} from 'react-cosmos-shared2/renderer';
import { WebpackRendererResponse } from 'react-cosmos-shared2/webpack';
import { getRendererId, getRendererConnect } from '../../../domRenderer';

declare var __DEV__: boolean;

type WebpackRendererConnect = RendererConnect<
  RendererRequest,
  WebpackRendererResponse
>;

export function initHmrErrorHandler() {
  if (__DEV__) {
    const rendererId = getRendererId();
    const rendererConnect = getRendererConnect() as WebpackRendererConnect;
    (window as any).onHotReloadError = () =>
      rendererConnect.postMessage({
        type: 'rendererHmrFail',
        payload: { rendererId }
      });
  }
}
