import React from 'react';
import {
  CoreSpec,
  MessageHandlerSpec,
  NotificationsSpec,
  RemoteRendererSpec,
  RendererCoreSpec,
} from 'react-cosmos-shared2/ui';
import { Message } from 'react-cosmos-shared2/util';
import { createPlugin } from 'react-plugin';
import { RemoteButton } from './RemoteButton';
import { RemoteRendererContext } from './shared';

const { onLoad, on, namedPlug, register } = createPlugin<RemoteRendererSpec>({
  name: 'remoteRenderer',
});

on<MessageHandlerSpec>('messageHandler', {
  rendererResponse: (context: RemoteRendererContext, msg: Message) => {
    const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
    rendererCore.receiveResponse(msg);
  },
});

on<RendererCoreSpec>('rendererCore', {
  request: (context: RemoteRendererContext, msg: Message) => {
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

function postRendererRequest(context: RemoteRendererContext, msg: Message) {
  const msgHandler = context.getMethodsOf<MessageHandlerSpec>('messageHandler');
  msgHandler.postRendererRequest(msg);
}
