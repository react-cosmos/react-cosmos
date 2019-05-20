import React from 'react';
import { createPlugin } from 'react-plugin';
import { Notifications } from './Notifications';
import { NotificationsSpec } from './public';
import {
  pushStickyNotification,
  removeStickyNotification,
  pushTimedNotification,
  clearTimedNotification
} from './pushNotification';

const { register, onLoad, plug } = createPlugin<NotificationsSpec>({
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

plug('previewGlobal', ({ pluginContext }) => {
  const { stickyNotifications, timedNotifications } = pluginContext.getState();
  const notifications =
    timedNotifications === null
      ? stickyNotifications
      : [...stickyNotifications, ...timedNotifications.items];

  return <Notifications notifications={notifications} />;
});

export { register };
