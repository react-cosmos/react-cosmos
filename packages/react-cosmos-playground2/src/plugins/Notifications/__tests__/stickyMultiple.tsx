import { act, render } from '@testing-library/react';
import React from 'react';
import { getNotificationsMethods } from 'react-cosmos-shared2/ui';
import { ArraySlot, loadPlugins, resetPlugins } from 'react-plugin';

beforeEach(() => jest.isolateModules(() => require('..')));

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
      info: 'Lorem ipsum.',
    });
    pushStickyNotification({
      id: 'two',
      type: 'info',
      title: 'Take a look at this',
      info: 'Lorem ipsum.',
    });
  });
}

it('renders multiple sticky notifications', async () => {
  const { getByText } = loadTestPlugins();

  pushStickyNotifications();
  getByText('Check this out');
  getByText('Take a look at this');
});
