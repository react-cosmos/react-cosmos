import { act, render } from '@testing-library/react';
import React from 'react';
import { ArraySlot, loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getNotificationsMethods,
  mockRouter
} from '../../../testHelpers/pluginMocks';

afterEach(() => {
  act(() => {
    resetPlugins();
  });
});

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
  getByText('Check this out');
  getByText('Take a look at this');
});

it('clears all timed notifications after timeout expires', async () => {
  mockRouter();
  register();
  const { queryByText } = loadTestPlugins();

  pushTimedNotifications();
  act(() => {
    jest.runAllTimers();
  });

  expect(queryByText('Check this out')).toBeNull();
  expect(queryByText('Take a look at this')).toBeNull();
});
