// @flow
/* eslint-env browser */

import type { RendererResponse } from 'react-cosmos-shared2/renderer';
import type { RendererPreviewContext } from './shared';

export function handleWindowMessages(context: RendererPreviewContext) {
  const handler = createMessageHandler(context);
  window.addEventListener('message', handler, false);

  return () => {
    window.removeEventListener('message', handler, false);
  };
}

function createMessageHandler(context) {
  return msg => {
    if (!isValidResponse(msg)) {
      return;
    }

    const response: RendererResponse = msg.data;
    context.callMethod('rendererCoordinator.receiveResponse', response);

    updateRuntimeStatus(context, response);
  };
}

function isValidResponse(msg) {
  return (
    // TODO: Create convention to filter out alien messages reliably (eg.
    // maybe tag msgs with source: "cosmos")
    // https://github.com/facebook/react-devtools/issues/812#issuecomment-308827334
    !msg.data.source &&
    // TODO: Improve message validation
    msg.data.type &&
    msg.data.payload
  );
}

function updateRuntimeStatus({ getState, setState }, response) {
  const { runtimeStatus } = getState();

  // Errors are not of interest anymore after renderer connectivity has been
  // established. Errors that occur after renderer is connected are likely
  // errors related to specific fixtures that the user can navigate away from.
  if (runtimeStatus === 'connected') {
    return;
  }

  switch (response.type) {
    case 'rendererReady': {
      return setState(prevState => ({
        ...prevState,
        runtimeStatus: 'connected'
      }));
    }
    case 'rendererError': {
      return setState(prevState => ({
        ...prevState,
        runtimeStatus: 'error'
      }));
    }
    default:
    // The rest of the responses are handled by the renderer coordinator
  }
}
