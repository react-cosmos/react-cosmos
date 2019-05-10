import React from 'react';
import { createPlugin } from 'react-plugin';
import { createArrayPlug } from '../../shared/slot';
import { Notifications, NotificationsProps } from './Notifications';
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

const ContentOverlayPlug = createArrayPlug<NotificationsProps>(
  'global',
  Notifications
);

plug('global', ({ pluginContext: { getState } }) => {
  const { notifications } = getState();
  return <ContentOverlayPlug notifications={notifications} />;
});

export { register };
