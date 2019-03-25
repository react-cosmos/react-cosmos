import { createPlugin } from 'react-plugin';
import { createArrayPlug } from '../../shared/slot';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { NotificationsSpec } from './../Notifications/public';
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
  slotName: 'rendererActions',
  render: createArrayPlug<RemoteButtonProps>('rendererActions', RemoteButton),
  getProps: ({ getMethodsOf }) => {
    const core = getMethodsOf<CoreSpec>('core');
    const notifications = getMethodsOf<NotificationsSpec>('notifications');
    return {
      devServerOn: core.isDevServerOn(),
      webRendererUrl: core.getWebRendererUrl(),
      pushNotification: notifications.pushNotification
    };
  }
});

export { register };
