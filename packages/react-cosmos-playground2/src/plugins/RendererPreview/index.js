// @flow

import { registerPlugin } from 'react-plugin';
import { checkRendererStatus } from './checkRendererStatus';
import { createRendererRequestHandler } from './onRendererRequest';
import { handleWindowMessages } from './handleWindowMessages';
import { RendererPreview } from './RendererPreview';

import type { RendererCoordinatorConfig } from '../RendererCoordinator';
import type { RendererPreviewState } from './shared';

export type { UrlStatus, RuntimeStatus, RendererPreviewState } from './shared';

export function register() {
  const { onRendererRequest, setIframeRef } = createRendererRequestHandler();

  const { init, on, plug } = registerPlugin<{}, RendererPreviewState>({
    name: 'rendererPreview',
    initialState: {
      urlStatus: 'unknown',
      runtimeStatus: 'pending'
    }
  });

  on('rendererCoordinator.request', onRendererRequest);

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
    getProps: context => getRendererPreviewProps(context, setIframeRef)
  });
}

function getRendererPreviewProps(context, onIframeRef) {
  return {
    rendererUrl: getRendererUrl(context),
    isVisible: isVisible(context),
    onIframeRef
  };
}

function getRendererUrl({ getConfigOf }) {
  const { webUrl }: RendererCoordinatorConfig = getConfigOf(
    'rendererCoordinator'
  );

  return webUrl;
}

function isVisible(context) {
  const { runtimeStatus } = context.getState();
  const rendererConnected = runtimeStatus === 'connected';
  const rendererBroken = runtimeStatus === 'error';

  // Here's a scenario when it's required to show the renderer preview iframe
  // even if no fixture is loaded: Say a run-time error occurs in the renderer
  // code (user build), inside a fixture or a global import. The Cosmos-related
  // renderer code is no longer able to report the list of fixture because its
  // host runtime already crashed. Without showing the renderer iframe
  // immediately, users would be stuck with a blank Playground UI state, with
  // no information on what's going on inside the renderer iframe.
  return (rendererConnected && isFixtureSelected(context)) || rendererBroken;
}

function isFixtureSelected({ getStateOf }) {
  return getStateOf('router').urlParams.fixturePath !== undefined;
}
