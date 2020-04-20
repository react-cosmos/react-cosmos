import React from 'react';
import { Notification } from './public';
import { Notifications } from './Notifications';

type Args = Pick<Notification, 'id' | 'title' | 'info'>;

export default {
  single: (
    <Notifications
      notifications={[
        createInfoNotification({
          id: 'renderer-connect-1',
          title: 'Renderer connected',
          info: 'Your fixtures are ready to use.',
        }),
      ]}
    />
  ),
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
          info:
            'Open the browser console or check your terminal for more information.',
        }),
      ]}
    />
  ),
};

function createSuccessNotification({ id, title, info }: Args): Notification {
  return { id, type: 'success', title, info };
}

function createErrorNotification({ id, title, info }: Args): Notification {
  return { id, type: 'error', title, info };
}

function createInfoNotification({ id, title, info }: Args): Notification {
  return { id, type: 'info', title, info };
}

function createLoadingNotification({ id, title, info }: Args): Notification {
  return { id, type: 'loading', title, info };
}
