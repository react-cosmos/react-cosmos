import { render } from '@testing-library/react';
import React, { act } from 'react';
import { ArraySlot, loadPlugins, resetPlugins } from 'react-plugin';
import { vi } from 'vitest';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';

beforeEach(register);

afterEach(() => {
  act(() => {
    resetPlugins();
  });
});

vi.useFakeTimers();

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
      info: 'Lorem ipsum.',
    });
    pushTimedNotification({
      id: 'two',
      type: 'info',
      title: 'Take a look at this',
      info: 'Lorem ipsum.',
    });
  });
}

it('renders multiple timed notifications', async () => {
  const { getByText } = loadTestPlugins();

  pushTimedNotifications();
  getByText('Check this out');
  getByText('Take a look at this');
});

it('clears all timed notifications after timeout expires', async () => {
  const { queryByText } = loadTestPlugins();

  pushTimedNotifications();
  act(() => {
    vi.runAllTimers();
  });

  expect(queryByText('Check this out')).toBeNull();
  expect(queryByText('Take a look at this')).toBeNull();
});
