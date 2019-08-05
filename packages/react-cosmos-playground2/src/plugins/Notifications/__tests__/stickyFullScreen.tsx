import { act, render, waitForElement } from '@testing-library/react';
import React from 'react';
import { ArraySlot, loadPlugins } from 'react-plugin';
import { register } from '..';
import { cleanup } from '../../../testHelpers/plugin';
import {
  getNotificationsMethods,
  mockRouter
} from '../../../testHelpers/pluginMocks';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="global" />);
}

function pushStickyNotification() {
  act(() =>
    getNotificationsMethods().pushStickyNotification({
      id: 'build',
      type: 'loading',
      title: 'Rebuilding...',
      info: 'Your code is updating.'
    })
  );
}

it('does not render sticky notification', async () => {
  mockRouter({ isFullScreen: () => true });
  register();
  const { queryByText } = loadTestPlugins();

  pushStickyNotification();
  expect(queryByText('Rebuilding...')).toBeNull();
});
