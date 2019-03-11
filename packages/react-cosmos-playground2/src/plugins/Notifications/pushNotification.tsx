import { removeItemMatch } from 'react-cosmos-shared2/util';
import { PluginContext } from 'react-plugin';
import {
  NotificationsSpec,
  Notification,
  PushNotificationArgs
} from './public';

type Context = PluginContext<NotificationsSpec>;

const TIMEOUT = 3000;

export function pushNotification(
  context: Context,
  { type, content }: PushNotificationArgs
) {
  const { notifications } = context.getState();
  const id = createNotificationId();
  const timeoutId = createClearTimeoutHandler(context, id);
  context.setState({
    notifications: [...notifications, { id, type, content, timeoutId }]
  });
}

export function cancelNotification(
  context: Context,
  { id, timeoutId }: Notification
) {
  clearNotification(context, id);
  clearTimeout(timeoutId);
}

let lastNotificationId = 0;

function createNotificationId() {
  return ++lastNotificationId;
}

function createClearTimeoutHandler(context: Context, notificationId: number) {
  return window.setTimeout(
    () => clearNotification(context, notificationId),
    TIMEOUT
  );
}

function clearNotification(context: Context, notificationId: number) {
  const { notifications } = context.getState();
  context.setState({
    notifications: removeItemMatch(notifications, n => n.id === notificationId)
  });
}
