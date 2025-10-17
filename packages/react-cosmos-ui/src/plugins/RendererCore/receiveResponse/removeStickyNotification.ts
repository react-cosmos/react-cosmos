import { RemoveStickyNotificationResponse } from 'react-cosmos-core';
import { NotificationsSpec } from '../../Notifications/spec.js';
import { RendererCoreContext } from '../shared/index.js';

export function receiveRemoveStickyNotificationResponse(
  context: RendererCoreContext,
  { payload }: RemoveStickyNotificationResponse
) {
  const { notificationId } = payload;
  const notifications =
    context.getMethodsOf<NotificationsSpec>('notifications');
  notifications.removeStickyNotification(notificationId);
}
