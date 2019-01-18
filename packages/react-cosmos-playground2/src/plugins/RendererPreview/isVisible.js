// @flow

import type { RendererPreviewContext } from './shared';

export function isVisible(context: RendererPreviewContext) {
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
