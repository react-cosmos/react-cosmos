import { act, render, waitForElement } from '@testing-library/react';
import React from 'react';
import { ArraySlot, enablePlugin, loadPlugins } from 'react-plugin';
import { register } from '..';
import { cleanup } from '../../../testHelpers/plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';

afterEach(cleanup);

jest.useFakeTimers();

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="previewGlobal" />);
}

function pushTimedNotification() {
  act(() =>
    getNotificationsMethods().pushTimedNotification({
      id: 'renderer-connect',
      type: 'success',
      title: 'Renderer connected',
      info: 'Your fixtures are ready to use.'
    })
  );
}

it('renders timed notification', async () => {
  register();
  const { getByText } = loadTestPlugins();

  pushTimedNotification();
  await waitForElement(() => getByText('Renderer connected'));
});

it('clears timed notification after timeout expires', async () => {
  register();
  const { queryByText } = loadTestPlugins();

  pushTimedNotification();
  act(() => jest.runAllTimers());

  expect(queryByText('Renderer connected')).toBeNull();
});

it('behaves peacefully when timeout expires after plugin unloads', async () => {
  register();
  loadTestPlugins();

  pushTimedNotification();
  act(() => {
    enablePlugin('notifications', false);
    jest.runAllTimers();
  });
});
