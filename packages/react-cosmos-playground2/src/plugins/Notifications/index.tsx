import React from 'react';
import { createPlugin } from 'react-plugin';
import { Notifications } from './Notifications';
import { NotificationsSpec } from './public';
import { pushNotification } from './pushNotification';
import { getNotifications } from './shared';

const { register, onLoad, plug } = createPlugin<NotificationsSpec>({
  name: 'notifications',
  initialState: null,
  methods: {
    pushNotification
  }
});

onLoad(context => {
  return () => {
    // Clean up notifications when plugin unloads
    const state = context.getState();
    if (state) {
      window.clearInterval(state.timeoutId);
      context.setState(null);
    }
  };
});

plug('previewGlobal', ({ pluginContext }) => (
  <Notifications notifications={getNotifications(pluginContext)} />
));

export { register };
