import { PushStickyNotificationResponse } from 'react-cosmos-core';
import { NotificationsSpec } from '../../Notifications/spec.js';
import { RendererCoreContext } from '../shared/index.js';

export function receivePushStickyNotificationResponse(
  context: RendererCoreContext,
  { payload }: PushStickyNotificationResponse
) {
  const { notification } = payload;
  const notifications =
    context.getMethodsOf<NotificationsSpec>('notifications');
  notifications.pushStickyNotification(notification);
}
