import { WebpackRendererResponse } from 'react-cosmos-shared2/webpack';
import { getRendererId, getRendererConnect } from '../../../domRenderer';

declare var __DEV__: boolean;

export function initHmrErrorHandler() {
  if (__DEV__) {
    const rendererId = getRendererId();
    const rendererConnect = getRendererConnect<any, WebpackRendererResponse>();
    (window as any).onHotReloadError = () =>
      rendererConnect.postMessage({
        type: 'rendererHmrFail',
        payload: { rendererId }
      });
  }
}
