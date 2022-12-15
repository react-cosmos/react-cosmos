export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};

export type NotificationsSpec = {
  name: 'notifications';
  state: {
    stickyNotifications: NotificationItem[];
    timedNotifications: null | {
      timeoutId: number;
      items: NotificationItem[];
    };
  };
  methods: {
    pushStickyNotification(notification: NotificationItem): void;
    removeStickyNotification(notificationId: string): void;
    pushTimedNotification(notification: NotificationItem): void;
  };
};
