import { act, render } from '@testing-library/react';
import React from 'react';
import {
  ArraySlot,
  enablePlugin,
  loadPlugins,
  resetPlugins,
} from 'react-plugin';
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

function pushTimedNotification() {
  act(() =>
    getNotificationsMethods().pushTimedNotification({
      id: 'renderer-connect',
      type: 'success',
      title: 'Renderer connected',
      info: 'Your fixtures are ready to use.',
    })
  );
}

it('renders timed notification', async () => {
  const { getByText } = loadTestPlugins();

  pushTimedNotification();
  getByText('Renderer connected');
});

it('clears timed notification after timeout expires', async () => {
  const { queryByText } = loadTestPlugins();

  pushTimedNotification();
  act(() => {
    vi.runAllTimers();
  });

  expect(queryByText('Renderer connected')).toBeNull();
});

it('behaves peacefully when timeout expires after plugin unloads', async () => {
  loadTestPlugins();

  pushTimedNotification();
  act(() => {
    enablePlugin('notifications', false);
    vi.runAllTimers();
  });
});
