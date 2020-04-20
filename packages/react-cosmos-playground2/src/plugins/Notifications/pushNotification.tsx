import { replaceOrAddItem, removeItemMatch } from 'react-cosmos-shared2/util';
import { Notification, NotificationsSpec } from './public';
import { NotificationsContext } from './shared';

const TIMEOUT = 3000;

export function pushStickyNotification(
  context: NotificationsContext,
  notification: Notification
) {
  context.setState((prevState) => ({
    ...prevState,
    stickyNotifications: replaceOrAddItem(
      prevState.stickyNotifications,
      (i) => i.id === notification.id,
      notification
    ),
  }));
}

export function removeStickyNotification(
  context: NotificationsContext,
  notificationId: string
) {
  context.setState((prevState) => ({
    ...prevState,
    stickyNotifications: removeItemMatch(
      prevState.stickyNotifications,
      (i) => i.id === notificationId
    ),
  }));
}

export function pushTimedNotification(
  context: NotificationsContext,
  notification: Notification
) {
  const { timedNotifications } = context.getState();
  if (timedNotifications !== null) {
    window.clearTimeout(timedNotifications.timeoutId);
  }

  context.setState((prevState) => ({
    ...prevState,
    timedNotifications: {
      timeoutId: createNotificationTimeout(context),
      items: replaceOrAddItem(
        getTimedNotifications(prevState),
        (i) => i.id === notification.id,
        notification
      ),
    },
  }));
}

export function clearTimedNotification(context: NotificationsContext) {
  context.setState((prevState) => ({
    ...prevState,
    timedNotifications: null,
  }));
}

function createNotificationTimeout(context: NotificationsContext) {
  return window.setTimeout(() => clearTimedNotification(context), TIMEOUT);
}

function getTimedNotifications(prevState: NotificationsSpec['state']) {
  const { timedNotifications } = prevState;
  return timedNotifications !== null ? timedNotifications.items : [];
}
