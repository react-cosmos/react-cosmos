import { act, render } from '@testing-library/react';
import React from 'react';
import {
  ArraySlot,
  enablePlugin,
  loadPlugins,
  resetPlugins,
} from 'react-plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';

beforeEach(() => jest.isolateModules(() => require('..')));

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
    jest.runAllTimers();
  });

  expect(queryByText('Renderer connected')).toBeNull();
});

it('behaves peacefully when timeout expires after plugin unloads', async () => {
  loadTestPlugins();

  pushTimedNotification();
  act(() => {
    enablePlugin('notifications', false);
    jest.runAllTimers();
  });
});
