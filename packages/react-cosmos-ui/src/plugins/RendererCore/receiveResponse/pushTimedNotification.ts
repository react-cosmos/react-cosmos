import { PushTimedNotificationResponse } from 'react-cosmos-core';
import { NotificationsSpec } from '../../Notifications/spec.js';
import { RendererCoreContext } from '../shared/index.js';

export function receivePushTimedNotificationResponse(
  context: RendererCoreContext,
  { payload }: PushTimedNotificationResponse
) {
  const { notification } = payload;
  const notifications = context.getMethodsOf<NotificationsSpec>('notifications');
  notifications.pushTimedNotification(notification);
}