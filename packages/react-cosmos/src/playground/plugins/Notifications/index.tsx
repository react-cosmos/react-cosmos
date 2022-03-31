import React from 'react';
import { createPlugin } from 'react-plugin';
import { NotificationsSpec } from '../../../ui/specs/NotificationsSpec';
import { Notifications } from './Notifications';
import {
  clearTimedNotification,
  pushStickyNotification,
  pushTimedNotification,
  removeStickyNotification,
} from './pushNotification';

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

register();
