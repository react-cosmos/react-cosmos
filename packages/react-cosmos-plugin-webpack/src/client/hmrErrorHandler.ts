import { rendererConnect } from 'react-cosmos/src/renderer/domRenderer/rendererConnect';
import { rendererId } from 'react-cosmos/src/renderer/domRenderer/rendererId';
import {
  RendererConnect,
  RendererRequest,
} from 'react-cosmos/src/renderer/types';
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
