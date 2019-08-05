import { act, render, waitForElement } from '@testing-library/react';
import React from 'react';
import { ArraySlot, loadPlugins } from 'react-plugin';
import { register } from '..';
import { cleanup } from '../../../testHelpers/plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';

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

it('renders sticky notification', async () => {
  register();
  const { getByText } = loadTestPlugins();

  pushStickyNotification();
  await waitForElement(() => getByText('Rebuilding...'));
});

it('removes sticky notification', async () => {
  register();
  const { getByText, queryByText } = loadTestPlugins();

  pushStickyNotification();
  await waitForElement(() => getByText('Rebuilding...'));

  act(() => getNotificationsMethods().removeStickyNotification('build'));
  expect(queryByText('Rebuilding...')).toBeNull();
});
