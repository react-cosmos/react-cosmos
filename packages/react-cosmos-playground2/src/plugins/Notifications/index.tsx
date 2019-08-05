import React from 'react';
import { createPlugin } from 'react-plugin';
import { RouterSpec } from '../Router/public';
import { Notifications } from './Notifications';
import { NotificationsSpec } from './public';
import {
  clearTimedNotification,
  pushStickyNotification,
  pushTimedNotification,
  removeStickyNotification
} from './pushNotification';

const { register, onLoad, namedPlug } = createPlugin<NotificationsSpec>({
  name: 'notifications',
  initialState: {
    stickyNotifications: [],
    timedNotifications: null
  },
  methods: {
    pushStickyNotification,
    removeStickyNotification,
    pushTimedNotification
  }
});

onLoad(context => {
  return () => {
    // Clean up timed notifications when plugin unloads
    const { timedNotifications } = context.getState();
    if (timedNotifications) {
      window.clearInterval(timedNotifications.timeoutId);
      clearTimedNotification(context);
    }
  };
});

namedPlug('global', 'notifications', ({ pluginContext }) => {
  const router = pluginContext.getMethodsOf<RouterSpec>('router');
  if (router.isFullScreen()) {
    return null;
  }

  const { stickyNotifications, timedNotifications } = pluginContext.getState();
  const notifications =
    timedNotifications === null
      ? stickyNotifications
      : [...stickyNotifications, ...timedNotifications.items];

  return <Notifications notifications={notifications} />;
});

export { register };
