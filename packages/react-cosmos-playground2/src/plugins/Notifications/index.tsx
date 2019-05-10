import React from 'react';
import { createPlugin } from 'react-plugin';
import { Notifications } from './Notifications';
import { NotificationsSpec } from './public';
import { pushNotification, cancelNotification } from './pushNotification';

const { register, onLoad, plug } = createPlugin<NotificationsSpec>({
  name: 'notifications',
  initialState: {
    notifications: []
  },
  methods: {
    pushNotification
  }
});

onLoad(context => {
  return () => {
    const { notifications } = context.getState();
    notifications.forEach(notification =>
      cancelNotification(context, notification)
    );
  };
});

plug('global', ({ pluginContext: { getState } }) => {
  const { notifications } = getState();
  return <Notifications notifications={notifications} />;
});

export { register };
