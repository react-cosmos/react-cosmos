import {
  RendererConnect,
  RendererRequest,
} from 'react-cosmos-shared2/renderer';
import { WebpackRendererResponse } from 'react-cosmos-shared2/webpack';
import { rendererConnect, rendererId } from '../../../dom';

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
