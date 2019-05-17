import React from 'react';
import styled from 'styled-components';
import { Notification } from './public';
import { Notifications } from './Notifications';

type Args = Pick<Notification, 'id' | 'title' | 'info'>;

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--grey6);
`;

export default {
  single: (
    <Notifications
      notifications={[
        createInfoNotification({
          id: 'renderer-connect-$RENDERER_ID1',
          title: 'Renderer connected',
          info: 'Your fixtures are ready to use.'
        })
      ]}
    />
  ),
  multiple: (
    <Background>
      <Notifications
        notifications={[
          createSuccessNotification({
            id: 'renderer-url-copy',
            title: 'Renderer URL copied to clipboard',
            info:
              'Paste the renderer URL in the address bar of another browser.'
          }),
          createInfoNotification({
            id: 'renderer-connect-$RENDERER_ID1',
            title: 'Renderer connected',
            info: 'Your fixtures are ready to use.'
          }),
          createInfoNotification({
            id: 'renderer-connect-$RENDERER_ID2',
            title: 'Renderer connected',
            info: 'Your fixtures are ready to use.'
          }),
          createLoadingNotification({
            id: 'hot-reload-$RENDERER_ID1',
            title: 'Hot reloading...',
            info: 'Your code is updating.'
          }),
          createErrorNotification({
            id: 'hot-reload-$RENDERER_ID2',
            title: 'Hot reload failed',
            info: 'Check the browser console for more information.'
          }),
          createSuccessNotification({
            id: 'hot-reload-$RENDERER_ID3',
            title: 'Hot reloaded successfully',
            info: 'Your code is up to date.'
          })
        ]}
      />
    </Background>
  )
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
