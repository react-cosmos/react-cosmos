export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};

export type TimedNotificationItem = Omit<NotificationItem, 'id'> & {
  id?: string;
};
