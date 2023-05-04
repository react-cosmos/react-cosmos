import React from 'react';
import { useSelect } from 'react-cosmos-renderer/client';
import { Notifications } from './Notifications.js';
import { NotificationItem, NotificationType } from './spec.js';

type Args = Pick<NotificationItem, 'id' | 'title' | 'info'>;

const titles: Record<NotificationType, string> = {
  error: 'Build failed',
  info: 'Renderer connected',
  loading: 'Rebuilding...',
  success: 'Renderer URL copied to clipboard',
};
const infos: Record<NotificationType, string> = {
  error:
    'Open the browser console or check your terminal for more information.',
  info: 'Your fixtures are ready to use.',
  loading: 'Your code is updating.',
  success: 'Paste the renderer URL in the address bar of another browser.',
};

function NotificationFixture() {
  const [type] = useSelect<NotificationType>('notification type', {
    options: ['error', 'info', 'loading', 'success'],
  });
  return (
    <Notifications
      notifications={[
        { id: '1', type, title: titles[type], info: infos[type] },
      ]}
    />
  );
}

export default {
  single: <NotificationFixture />,
  multiple: (
    <Notifications
      notifications={[
        createSuccessNotification({
          id: 'renderer-url-copy',
          title: 'Renderer URL copied to clipboard',
          info: 'Paste the renderer URL in the address bar of another browser.',
        }),
        createInfoNotification({
          id: 'renderer-connect-1',
          title: 'Renderer connected',
          info: 'Your fixtures are ready to use.',
        }),
        createInfoNotification({
          id: 'renderer-connect-2',
          title: 'Renderer connected',
          info: 'Your fixtures are ready to use.',
        }),
        createLoadingNotification({
          id: 'build',
          title: 'Rebuilding...',
          info: 'Your code is updating.',
        }),
        createErrorNotification({
          id: 'build-error',
          title: 'Build failed',
          info: 'Open the browser console or check your terminal for more information.',
        }),
      ]}
    />
  ),
};

function createSuccessNotification({
  id,
  title,
  info,
}: Args): NotificationItem {
  return { id, type: 'success', title, info };
}

function createErrorNotification({ id, title, info }: Args): NotificationItem {
  return { id, type: 'error', title, info };
}

function createInfoNotification({ id, title, info }: Args): NotificationItem {
  return { id, type: 'info', title, info };
}

function createLoadingNotification({
  id,
  title,
  info,
}: Args): NotificationItem {
  return { id, type: 'loading', title, info };
}
