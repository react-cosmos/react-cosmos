export type NotificationType = 'success' | 'error';

export type Notification = {
  id: number;
  type: NotificationType;
  content: string;
  timeoutId: number;
};

export type NotificationsSpec = {
  name: 'notifications';
  state: {
    notifications: Notification[];
  };
  methods: {
    pushNotification(args: { type: NotificationType; content: string }): void;
  };
};
