import React from 'react';
import { createPlugin } from 'react-plugin';
import { Notifications } from './Notifications.js';
import {
  clearTimedNotification,
  pushStickyNotification,
  pushTimedNotification,
  removeStickyNotification,
} from './pushNotification.js';
import { NotificationsSpec } from './spec.js';

const { register, onLoad, namedPlug } = createPlugin<NotificationsSpec>({
  name: 'notifications',
  initialState: {
    stickyNotifications: [],
    timedNotifications: null,
  },
  methods: {
    pushStickyNotification,
    removeStickyNotification,
    pushTimedNotification,
  },
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
  const { stickyNotifications, timedNotifications } = pluginContext.getState();
  const notifications =
    timedNotifications === null
      ? stickyNotifications
      : [...stickyNotifications, ...timedNotifications.items];

  return <Notifications notifications={notifications} />;
});

export { register };

if (process.env.NODE_ENV !== 'test') register();
