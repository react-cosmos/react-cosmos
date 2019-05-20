import { replaceOrAddItem, removeItemMatch } from 'react-cosmos-shared2/util';
import { Notification, NotificationsSpec } from './public';
import { Context } from './shared';

const TIMEOUT = 3000;

export function pushStickyNotification(
  context: Context,
  notification: Notification
) {
  context.setState(prevState => ({
    ...prevState,
    stickyNotifications: replaceOrAddItem(
      prevState.stickyNotifications,
      i => i.id === notification.id,
      notification
    )
  }));
}

export function removeStickyNotification(
  context: Context,
  notificationId: string
) {
  context.setState(prevState => ({
    ...prevState,
    stickyNotifications: removeItemMatch(
      prevState.stickyNotifications,
      i => i.id === notificationId
    )
  }));
}

export function pushTimedNotification(
  context: Context,
  notification: Notification
) {
  const { timedNotifications } = context.getState();
  if (timedNotifications !== null) {
    window.clearTimeout(timedNotifications.timeoutId);
  }

  context.setState(prevState => ({
    ...prevState,
    timedNotifications: {
      timeoutId: createNotificationTimeout(context),
      items: replaceOrAddItem(
        getTimedNotifications(prevState),
        i => i.id === notification.id,
        notification
      )
    }
  }));
}

export function clearTimedNotification(context: Context) {
  context.setState(prevState => ({
    ...prevState,
    timedNotifications: null
  }));
}

function createNotificationTimeout(context: Context) {
  return window.setTimeout(() => clearTimedNotification(context), TIMEOUT);
}

function getTimedNotifications(prevState: NotificationsSpec['state']) {
  const { timedNotifications } = prevState;
  return timedNotifications !== null ? timedNotifications.items : [];
}
