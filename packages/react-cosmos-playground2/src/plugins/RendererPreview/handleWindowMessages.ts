import { RendererResponse } from 'react-cosmos-shared2/renderer';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { RendererPreviewContext } from './shared';

type WindowMsg = { data: { [key: string]: unknown } };

export function handleWindowMessages(context: RendererPreviewContext) {
  const handler = createMessageHandler(context);
  window.addEventListener('message', handler, false);

  return () => {
    window.removeEventListener('message', handler, false);
  };
}

function createMessageHandler(context: RendererPreviewContext) {
  return (msg: WindowMsg) => {
    if (!isValidResponse(msg)) {
      return;
    }

    const router = context.getMethodsOf<RouterSpec>('router');
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    const response = msg.data as RendererResponse;
    rendererCore.receiveResponse(response);

    updateRuntimeStatus(context, response);

    if (response.type === 'rendererReady') {
      const { rendererId, initialFixtureId } = response.payload;
      rendererCore.selectPrimaryRenderer(rendererId);
      if (initialFixtureId) {
        router.selectFixture(initialFixtureId);
      }
    }
  };
}

function isValidResponse(msg: WindowMsg) {
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

function updateRuntimeStatus(
  { getState, setState }: RendererPreviewContext,
  response: RendererResponse
) {
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
        runtimeStatus: 'connected',
      }));
    }
    case 'rendererError': {
      return setState(prevState => ({
        ...prevState,
        runtimeStatus: 'error',
      }));
    }
    default:
    // The rest of the responses are handled by the renderer core plugin
  }
}
