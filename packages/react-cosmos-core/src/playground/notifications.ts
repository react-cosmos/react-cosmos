export type NotificationType = 'success' | 'error' | 'info' | 'loading';

export type NotificationItem = {
  // TODO: Make the id optional when the notification isn't sticky
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};
