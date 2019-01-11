// @flow
/* eslint-env browser */

import type { RendererPreviewContext } from './shared';

export function checkRendererStatus(
  context: RendererPreviewContext,
  rendererUrl: string
) {
  // We can't do fetch requests when Cosmos exports are opened without a
  // web server (ie. via file:/// protocol) so we're left to _assume_ the
  // renderer iframe loads alright.
  if (location.protocol === 'file:') {
    return;
  }

  // The plugin might unmount before the fetch call returns a status, in which
  // case we no longer want to update the (unmounted) plugin state
  let unmounted = false;

  fetch(rendererUrl, { credentials: 'same-origin' }).then(({ status }) => {
    if (unmounted) {
      return;
    }

    context.setState(state => ({
      ...state,
      urlStatus: status === 200 ? 'ok' : 'error'
    }));
  });

  return () => {
    unmounted = true;
  };
}
