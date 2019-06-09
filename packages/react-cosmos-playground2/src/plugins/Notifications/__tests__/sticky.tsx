import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { ArraySlot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="previewGlobal" />);
}

function pushStickyNotification() {
  getNotificationsMethods().pushStickyNotification({
    id: 'build',
    type: 'loading',
    title: 'Rebuilding...',
    info: 'Your code is updating.'
  });
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

  getNotificationsMethods().removeStickyNotification('build');
  expect(queryByText('Rebuilding...')).toBeNull();
});
