import * as React from 'react';
import { loadPlugins, Slot, MethodHandlers } from 'react-plugin';
import { render, waitForElement, fireEvent, wait } from 'react-testing-library';
import { cleanup, mockMethodsOf, mockPlug } from '../../../testHelpers/plugin';
import { NotificationsSpec } from '../../Notifications/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { createFixtureAction } from '../../RendererHeader/public';
import { register } from '..';

afterEach(cleanup);

function mockRendererCore(
  webUrl: null | string,
  remoteRenderersEnabled: boolean
) {
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getWebUrl: () => webUrl,
    remoteRenderersEnabled: () => remoteRenderersEnabled
  });
}

type PushNotification = MethodHandlers<NotificationsSpec>['pushNotification'];

function mockNotifications(pushNotification: PushNotification = () => {}) {
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification
  });
}

function mockFixtureAction() {
  mockPlug({
    slotName: 'fixtureActions',
    render: createFixtureAction(() => <>fooFixtureAction</>)
  });
}

it(`doesn't render button when webUrl is empty`, async () => {
  register();
  mockRendererCore(null, true);
  mockNotifications();
  mockFixtureAction();

  loadPlugins();
  const { getByText, queryByText } = render(<Slot name="fixtureActions" />);

  await waitForElement(() => getByText(/fooFixtureAction/i));
  expect(queryByText(/remote/i)).toBeNull();
});

it(`doesn't render button when remote renderers are disabled`, async () => {
  register();
  mockRendererCore('mockWebUrl', false);
  mockNotifications();
  mockFixtureAction();

  loadPlugins();
  const { getByText, queryByText } = render(<Slot name="fixtureActions" />);

  await waitForElement(() => getByText(/fooFixtureAction/i));
  expect(queryByText(/remote/i)).toBeNull();
});

it('renders button', async () => {
  register();
  mockRendererCore('mockWebUrl', true);
  mockNotifications();

  loadPlugins();
  const { getByText } = render(<Slot name="fixtureActions" />);

  await waitForElement(() => getByText(/remote/i));
});

it('notifies copy error on button click', async () => {
  register();
  mockRendererCore('mockWebUrl', true);

  const pushNotification = jest.fn();
  mockNotifications(pushNotification);

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
