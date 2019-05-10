import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { NotificationsSpec } from './../Notifications/public';
import { RendererRemoteSpec } from './public';
import { initSocket, onRendererRequest } from './socket';
import { RemoteButton } from './RemoteButton';

const { onLoad, on, plug, register } = createPlugin<RendererRemoteSpec>({
  name: 'rendererRemote'
});

onLoad(initSocket);

on<RendererCoreSpec>('rendererCore', {
  request: onRendererRequest
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
