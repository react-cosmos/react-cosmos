import React from 'react';
import { createPlugin } from 'react-plugin';
import {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import { CoreSpec } from '../Core/public';
import { MessageHandlerSpec } from '../MessageHandler/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { NotificationsSpec } from '../Notifications/public';
import { RendererRemoteSpec } from './public';
import { Context } from './shared';
import { RemoteButton } from './RemoteButton';

const { onLoad, on, plug, register } = createPlugin<RendererRemoteSpec>({
  name: 'rendererRemote'
});

on<MessageHandlerSpec>('messageHandler', {
  rendererResponse: (context: Context, msg: RendererResponse) => {
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    rendererCore.receiveResponse(msg);
  }
});

on<RendererCoreSpec>('rendererCore', {
  request: (context: Context, msg: RendererRequest) => {
    postRendererRequest(context, msg);
  }
});

onLoad(context => {
  // Discover remote renderers by asking all to announce themselves
  postRendererRequest(context, {
    type: 'pingRenderers'
  });
});

plug('rendererActions', ({ pluginContext: { getMethodsOf } }) => {
  const core = getMethodsOf<CoreSpec>('core');
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  return (
    <RemoteButton
      devServerOn={core.isDevServerOn()}
      webRendererUrl={core.getWebRendererUrl()}
      pushNotification={notifications.pushNotification}
    />
  );
});

export { register };

function postRendererRequest(context: Context, msg: RendererRequest) {
  const msgHandler = context.getMethodsOf<MessageHandlerSpec>('messageHandler');
  msgHandler.postRendererRequest(msg);
}
