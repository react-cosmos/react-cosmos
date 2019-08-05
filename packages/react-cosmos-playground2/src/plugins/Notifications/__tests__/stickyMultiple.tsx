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

function pushStickyNotifications() {
  const { pushStickyNotification } = getNotificationsMethods();
  act(() => {
    pushStickyNotification({
      id: 'one',
      type: 'info',
      title: 'Check this out',
      info: 'Lorem ipsum.'
    });
    pushStickyNotification({
      id: 'two',
      type: 'info',
      title: 'Take a look at this',
      info: 'Lorem ipsum.'
    });
  });
}

it('renders multiple sticky notifications', async () => {
  mockRouter();
  register();
  const { getByText } = loadTestPlugins();

  pushStickyNotifications();
  await waitForElement(() => getByText('Check this out'));
  await waitForElement(() => getByText('Take a look at this'));
});
