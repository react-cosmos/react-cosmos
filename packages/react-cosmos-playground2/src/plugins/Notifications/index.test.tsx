import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { ArraySlot, loadPlugins, enablePlugin } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../testHelpers/plugin';
import { NotificationsSpec } from './public';
import { register } from '.';

afterEach(cleanup);

jest.useFakeTimers();

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="previewGlobal" />);
}

function getNotificationsMethods() {
  return getMethodsOf<NotificationsSpec>('notifications');
}

function pushNotification() {
  getNotificationsMethods().pushNotification({
    id: 'renderer-connect',
    type: 'success',
    title: 'Renderer connected',
    info: 'Your fixtures are ready to use.'
  });
}

it('renders pushed notification', async () => {
  register();
  const { getByText } = loadTestPlugins();

  pushNotification();
  await waitForElement(() => getByText(/renderer connected/i));
});

it('clears pushed notification after timeout expires', async () => {
  register();
  const { queryByText } = loadTestPlugins();

  pushNotification();
  jest.runAllTimers();

  expect(queryByText(/renderer connected/i)).toBeNull();
});

it('behaves peacefully when timeout expires after plugin unloads', async () => {
  register();
  loadTestPlugins();

  pushNotification();
  enablePlugin('notifications', false);
  jest.runAllTimers();
});
