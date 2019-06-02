import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { ArraySlot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

jest.useFakeTimers();

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="previewGlobal" />);
}

function pushTimedNotifications() {
  const { pushTimedNotification } = getNotificationsMethods();
  pushTimedNotification({
    id: 'one',
    type: 'info',
    title: 'Check this out',
    info: 'Lorem ipsum.'
  });
  pushTimedNotification({
    id: 'two',
    type: 'info',
    title: 'Take a look at this',
    info: 'Lorem ipsum.'
  });
}

it('renders multiple timed notifications', async () => {
  register();
  const { getByText } = loadTestPlugins();

  pushTimedNotifications();
  await waitForElement(() => getByText('Check this out'));
  await waitForElement(() => getByText('Take a look at this'));
});

it('clears all timed notifications after timeout expires', async () => {
  register();
  const { queryByText } = loadTestPlugins();

  pushTimedNotifications();
  jest.runAllTimers();

  expect(queryByText('Check this out')).toBeNull();
  expect(queryByText('Take a look at this')).toBeNull();
});
