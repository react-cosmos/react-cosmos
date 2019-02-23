import { createPlugin } from 'react-plugin';
import { createGlobalPlug } from '../Core/public';
import { Notifications, NotificationsProps } from './Notifications';
import { NotificationsSpec } from './public';
import { pushNotification } from './pushNotification';

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
    notifications.forEach(({ timeoutId }) => clearTimeout(timeoutId));
  };
});

plug({
  slotName: 'global',
  render: createGlobalPlug<NotificationsProps>(Notifications),
  getProps: ({ getState }) => {
    const { notifications } = getState();
    return { notifications };
  }
});

export { register };
