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

jest.useFakeTimers();

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="global" />);
}

function pushTimedNotifications() {
  const { pushTimedNotification } = getNotificationsMethods();
  act(() => {
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
  });
}

it('renders multiple timed notifications', async () => {
  mockRouter();
  register();
  const { getByText } = loadTestPlugins();

  pushTimedNotifications();
  await waitForElement(() => getByText('Check this out'));
  await waitForElement(() => getByText('Take a look at this'));
});

it('clears all timed notifications after timeout expires', async () => {
  mockRouter();
  register();
  const { queryByText } = loadTestPlugins();

  pushTimedNotifications();
  act(() => jest.runAllTimers());

  expect(queryByText('Check this out')).toBeNull();
  expect(queryByText('Take a look at this')).toBeNull();
});
