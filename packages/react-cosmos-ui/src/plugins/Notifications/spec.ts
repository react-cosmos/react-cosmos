import { NotificationItem } from 'react-cosmos-core';

export type { NotificationItem, NotificationType } from 'react-cosmos-core';

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
