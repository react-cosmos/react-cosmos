import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins, enablePlugin } from 'react-plugin';
import { cleanup, getMethodsOf } from '../../testHelpers/plugin';
import { NotificationsSpec } from './public';
import { register } from '.';

afterEach(cleanup);

jest.useFakeTimers();

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="global" />);
}

function getNotificationsMethods() {
  return getMethodsOf<NotificationsSpec>('notifications');
}

function pushNotification() {
  getNotificationsMethods().pushNotification({
    type: 'success',
    content: 'Renderer connected'
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

it('behaves peacefully after unload when timeout expires', async () => {
  register();
  loadTestPlugins();

  pushNotification();
  enablePlugin('notifications', false);
  jest.runAllTimers();
});
