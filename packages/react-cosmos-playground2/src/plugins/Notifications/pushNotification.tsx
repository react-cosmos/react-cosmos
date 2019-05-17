import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import { Notification } from './public';
import { Context, getNotifications } from './shared';

const TIMEOUT = 3000;

export function pushNotification(context: Context, notification: Notification) {
  const state = context.getState();
  if (state !== null) {
    window.clearTimeout(state.timeoutId);
  }

  context.setState({
    timeoutId: createClearTimeoutHandler(context),
    notifications: replaceOrAddItem(
      getNotifications(context),
      i => i.id === notification.id,
      notification
    )
  });
}

function createClearTimeoutHandler(context: Context) {
  return window.setTimeout(() => context.setState(null), TIMEOUT);
}
