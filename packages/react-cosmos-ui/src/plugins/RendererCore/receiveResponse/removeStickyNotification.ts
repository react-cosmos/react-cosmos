import type { RemoveStickyNotificationResponse } from 'react-cosmos-core';
import type { NotificationsSpec } from '../../Notifications/spec.js';
import type { RendererCoreContext } from '../shared/index.js';

export function receiveRemoveStickyNotificationResponse(
  context: RendererCoreContext,
  { payload }: RemoveStickyNotificationResponse
) {
  const { notificationId } = payload;
  const notifications =
    context.getMethodsOf<NotificationsSpec>('notifications');
  notifications.removeStickyNotification(notificationId);
}
