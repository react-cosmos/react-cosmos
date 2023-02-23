import { RendererPreviewContext } from './shared.js';

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

  // TODO: Test this
  fetch(rendererUrl, { credentials: 'same-origin' })
    .then(({ status }) => {
      if (!unmounted) {
        context.setState(state => ({
          ...state,
          urlStatus: status === 200 ? 'ok' : 'error',
        }));
      }
    })
    .catch(err => {
      console.log(err);
      if (!unmounted) {
        context.setState(state => ({
          ...state,
          urlStatus: 'error',
        }));
      }
    });

  return () => {
    unmounted = true;
  };
}
