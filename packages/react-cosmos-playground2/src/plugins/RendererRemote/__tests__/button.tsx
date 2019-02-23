import * as React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { render, waitForElement, fireEvent, wait } from 'react-testing-library';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { NotificationsSpec } from '../../Notifications/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getWebUrl: () => 'mockWebUrl',
    remoteRenderersEnabled: () => true
  });
}

it('renders button', async () => {
  registerTestPlugins();

  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification: () => {}
  });

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  await waitForElement(() => getByText(/remote/i));
});

it('notifies copy error on button click', async () => {
  registerTestPlugins();

  const pushNotification = jest.fn();
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification
  });

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  const button = getByText(/remote/i);
  fireEvent.click(button);

  // Clipboard API isn't available in jsdom so we only test the error path
  await wait(() =>
    expect(pushNotification).toBeCalledWith(expect.any(Object), {
      type: 'error',
      content: `Failed to copy renderer URL to clipboard`
    })
  );
});
