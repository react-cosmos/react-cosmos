export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};

export type NotificationsSpec = {
  name: 'notifications';
  state: null | {
    timeoutId: number;
    notifications: Notification[];
  };
  methods: {
    pushNotification(args: Notification): void;
  };
};
