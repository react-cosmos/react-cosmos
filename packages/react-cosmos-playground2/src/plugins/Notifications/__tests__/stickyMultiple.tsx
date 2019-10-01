import { act, render } from '@testing-library/react';
import React from 'react';
import { ArraySlot, loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

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
  register();
  const { getByText } = loadTestPlugins();

  pushStickyNotifications();
  getByText('Check this out');
  getByText('Take a look at this');
});
