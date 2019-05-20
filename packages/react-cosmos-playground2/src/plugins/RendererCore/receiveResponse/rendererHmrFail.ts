import { NotificationsSpec } from './../../Notifications/public';
import { RendererHmrFailResponse } from 'react-cosmos-shared2/renderer';
import { Context } from '../shared';

export function receiveRendererHmrFailResponse(
  context: Context,
  { payload }: RendererHmrFailResponse
) {
  const { rendererId } = payload;
  const notifs = context.getMethodsOf<NotificationsSpec>('notifications');
  notifs.pushTimedNotification({
    id: `renderer-hmr-fail-${rendererId}`,
    type: 'error',
    title: 'Hot reload failed',
    info: 'Check the browser console to see which module failed to hot reload.'
  });
}
