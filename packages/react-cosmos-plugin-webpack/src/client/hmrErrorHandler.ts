import { RendererConnect, RendererRequest } from 'react-cosmos/src';
import { rendererConnect, rendererId } from 'react-cosmos/src/dom';
import { WebpackRendererResponse } from '../rendererResponse';

declare var __DEV__: boolean;

type WebpackRendererConnect = RendererConnect<
  RendererRequest,
  WebpackRendererResponse
>;

if (__DEV__) {
  const webpackRendererConnect = rendererConnect as WebpackRendererConnect;
  (window as any).onHotReloadError = () =>
    webpackRendererConnect.postMessage({
      type: 'rendererHmrFail',
      payload: { rendererId },
    });
}
