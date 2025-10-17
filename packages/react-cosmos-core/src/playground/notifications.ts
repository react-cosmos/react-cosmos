export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};

export type TimedNotificationItem = NotificationItem & {
  id?: string;
};
