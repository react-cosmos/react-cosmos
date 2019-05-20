export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};

export type NotificationsSpec = {
  name: 'notifications';
  state: {
    stickyNotifications: Notification[];
    timedNotifications: null | {
      timeoutId: number;
      items: Notification[];
    };
  };
  methods: {
    pushStickyNotification(notification: Notification): void;
    removeStickyNotification(notificationId: string): void;
    pushTimedNotification(notification: Notification): void;
  };
};
