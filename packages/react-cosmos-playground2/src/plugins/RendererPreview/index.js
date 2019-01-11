// @flow

import { registerPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { handleWindowMessages } from './handleWindowMessages';
import { RendererPreview } from './RendererPreview';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { RendererConfig } from '../Renderer';
import type { RendererPreviewState } from './shared';

export type { RendererPreviewUrlStatus, RendererPreviewState } from './shared';

export function register() {
  const { init, on, plug } = registerPlugin<{}, RendererPreviewState>({
    name: 'rendererPreview',
    initialState: {
      urlStatus: 'unknown'
    }
  });

  let iframeRef: null | window = null;

  on('renderer.request', (context, msg: RendererRequest) => {
    if (iframeRef) {
      iframeRef.contentWindow.postMessage(msg, '*');
    }
  });

  init(context => {
    const rendererUrl = getRendererUrl(context);

    if (rendererUrl) {
      return [
        checkRendererStatus(context, rendererUrl),
        handleWindowMessages(context)
      ];
    }
  });

  plug({
    slotName: 'rendererPreview',
    render: RendererPreview,
    getProps: context => {
      return {
        rendererUrl: getRendererUrl(context),
        isFixtureLoaded: isFixtureloaded(context),
        onIframeRef: elRef => {
          iframeRef = elRef;
        }
      };
    }
  });
}

function getRendererUrl({ getConfigOf }) {
  const { webUrl }: RendererConfig = getConfigOf('renderer');

  return webUrl;
}

function isFixtureloaded({ callMethod }) {
  const primaryRendererState = callMethod('renderer.getPrimaryRendererState');

  return Boolean(primaryRendererState && primaryRendererState.fixtureState);
}
