import React from 'react';
import { createPlugin } from 'react-plugin';
import { Message } from 'react-cosmos-shared2/util';
import { CoreSpec } from '../Core/public';
import { MessageHandlerSpec } from '../MessageHandler/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { NotificationsSpec } from '../Notifications/public';
import { RendererRemoteSpec } from './public';
import { Context } from './shared';
import { RemoteButton } from './RemoteButton';

const { onLoad, on, namedPlug, register } = createPlugin<RendererRemoteSpec>({
  name: 'rendererRemote'
});

on<MessageHandlerSpec>('messageHandler', {
  rendererResponse: (context: Context, msg: Message) => {
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    rendererCore.receiveResponse(msg);
  }
});

on<RendererCoreSpec>('rendererCore', {
  request: (context: Context, msg: Message) => {
    postRendererRequest(context, msg);
  }
});

onLoad(context => {
  // Discover remote renderers by asking all to announce themselves
  postRendererRequest(context, {
    type: 'pingRenderers'
  });
});

namedPlug('rendererAction', 'remoteRenderer', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const core = getMethodsOf<CoreSpec>('core');
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  return (
    <RemoteButton
      devServerOn={core.isDevServerOn()}
      webRendererUrl={core.getWebRendererUrl()}
      pushNotification={notifications.pushTimedNotification}
    />
  );
});

export { register };

function postRendererRequest(context: Context, msg: Message) {
  const msgHandler = context.getMethodsOf<MessageHandlerSpec>('messageHandler');
  msgHandler.postRendererRequest(msg);
}
