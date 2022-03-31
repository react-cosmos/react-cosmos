import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../../../ui/specs/CoreSpec';
import { MessageHandlerSpec } from '../../../ui/specs/MessageHandlerSpec';
import { NotificationsSpec } from '../../../ui/specs/NotificationsSpec';
import { RemoteRendererSpec } from '../../../ui/specs/RemoteRendererSpec';
import { RendererCoreSpec } from '../../../ui/specs/RendererCoreSpec';
import { MessageType } from '../../../utils/message';
import { RemoteButton } from './RemoteButton';
import { RemoteRendererContext } from './shared';

const { onLoad, on, namedPlug, register } = createPlugin<RemoteRendererSpec>({
  name: 'remoteRenderer',
});

on<MessageHandlerSpec>('messageHandler', {
  rendererResponse: (context: RemoteRendererContext, msg: MessageType) => {
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    rendererCore.receiveResponse(msg);
  },
});

on<RendererCoreSpec>('rendererCore', {
  request: (context: RemoteRendererContext, msg: MessageType) => {
    postRendererRequest(context, msg);
  },
});

onLoad(context => {
  // Discover remote renderers by asking all to announce themselves
  postRendererRequest(context, {
    type: 'pingRenderers',
  });
});

namedPlug('globalAction', 'remoteRenderer', ({ pluginContext }) => {
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

register();

function postRendererRequest(context: RemoteRendererContext, msg: MessageType) {
  const msgHandler = context.getMethodsOf<MessageHandlerSpec>('messageHandler');
  msgHandler.postRendererRequest(msg);
}
