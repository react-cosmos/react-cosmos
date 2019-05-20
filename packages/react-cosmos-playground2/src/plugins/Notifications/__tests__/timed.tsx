import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { ArraySlot, loadPlugins, enablePlugin } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { getNotificationsMethods } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

jest.useFakeTimers();

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="previewGlobal" />);
}

function pushTimedNotification() {
  getNotificationsMethods().pushTimedNotification({
    id: 'renderer-connect',
    type: 'success',
    title: 'Renderer connected',
    info: 'Your fixtures are ready to use.'
  });
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
  jest.runAllTimers();

  expect(queryByText('Renderer connected')).toBeNull();
});

it('behaves peacefully when timeout expires after plugin unloads', async () => {
  register();
  loadTestPlugins();

  pushTimedNotification();
  enablePlugin('notifications', false);
  jest.runAllTimers();
});
