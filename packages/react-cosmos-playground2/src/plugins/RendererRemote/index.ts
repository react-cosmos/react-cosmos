import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/public';
import { createFixtureAction } from '../RendererHeader/public';
import { RendererRemoteSpec } from './public';
import { initSocket, onRendererRequest } from './socket';
import { RemoteButton, RemoteButtonProps } from './RemoteButton';

const { onLoad, on, plug, register } = createPlugin<RendererRemoteSpec>({
  name: 'rendererRemote'
});

onLoad(initSocket);

on<RendererCoreSpec>('rendererCore', {
  request: onRendererRequest
});

plug({
  slotName: 'fixtureActions',
  render: createFixtureAction<RemoteButtonProps>(RemoteButton),
  getProps: ({ getMethodsOf }) => {
    const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
    return {
      remoteRenderersEnabled: rendererCore.remoteRenderersEnabled(),
      webRendererUrl: rendererCore.getWebUrl()
    };
  }
});

export { register };
