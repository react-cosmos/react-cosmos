import React from 'react';
import { MessageType } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/spec.js';
import { MessageHandlerSpec } from '../MessageHandler/spec.js';
import { NotificationsSpec } from '../Notifications/spec.js';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { RemoteButton } from './RemoteButton/index.js';
import { RemoteRendererContext } from './shared.js';
import { RemoteRendererSpec } from './spec.js';

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

export { register };

if (process.env.NODE_ENV !== 'test') register();

function postRendererRequest(context: RemoteRendererContext, msg: MessageType) {
  const msgHandler = context.getMethodsOf<MessageHandlerSpec>('messageHandler');
  msgHandler.postRendererRequest(msg);
}
