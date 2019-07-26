import React from 'react';
import { render, waitForElement, act } from '@testing-library/react';
import { ArraySlot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="previewGlobal" />);
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

  act(() => pushStickyNotifications());
  await waitForElement(() => getByText('Check this out'));
  await waitForElement(() => getByText('Take a look at this'));
});
