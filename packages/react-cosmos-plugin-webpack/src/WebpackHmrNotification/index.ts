import { MessageType, NotificationsSpec, RendererCoreSpec } from 'react-cosmos';
import { createPlugin, PluginContext } from 'react-plugin';
import { WebpackRendererResponse } from '../rendererResponse.js';
import { WebpackHmrNotificationSpec } from './spec.js';

type WebpackHmrNotificationContext = PluginContext<WebpackHmrNotificationSpec>;

const { on, register } = createPlugin<WebpackHmrNotificationSpec>({
  name: 'webpackHmrNotification',
});

on<RendererCoreSpec>('rendererCore', {
  response: onRendererResponse,
});

register();

function onRendererResponse(
  context: WebpackHmrNotificationContext,
  msg: MessageType
) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');

  const rendererResponse = msg as WebpackRendererResponse;
  switch (rendererResponse.type) {
    case 'rendererHmrFail':
      notifications.pushTimedNotification({
        // This event could potentially be triggered by multiple renderers at
        // once, but it only makes sense that hot reloading should fail the same
        // in all of them. To prevent duplicating this error in such cases the
        // notification ID is _not_ unique per renderer.
        id: 'renderer-hmr-fail',
        type: 'error',
        title: 'Hot reload failed',
        info: 'Check the browser console to see which module failed to hot reload.',
      });

    default:
    // Nada
  }
}
