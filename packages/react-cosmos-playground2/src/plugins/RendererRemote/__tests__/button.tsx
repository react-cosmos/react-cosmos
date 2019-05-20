import * as React from 'react';
import { loadPlugins, ArraySlot, MethodHandlers } from 'react-plugin';
import { render, waitForElement, fireEvent, wait } from 'react-testing-library';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import * as pluginMocks from '../../../testHelpers/pluginMocks';
import { NotificationsSpec } from '../../Notifications/public';
import { register } from '..';

afterEach(cleanup);

type PushNotification = MethodHandlers<NotificationsSpec>['pushNotification'];

function mockCore(devServerOn: boolean, webRendererUrl: null | string) {
  pluginMocks.mockCore({
    isDevServerOn: () => devServerOn,
    getWebRendererUrl: () => webRendererUrl
  });
}

function mockMessageHandler() {
  pluginMocks.mockMessageHandler({ postRendererRequest: () => {} });
}

function mockNotifications(pushNotification: PushNotification = () => {}) {
  pluginMocks.mockNotifications({ pushNotification });
}

function mockRendererAction() {
  mockPlug('rendererActions', () => <>fooAction</>);
}

it(`doesn't render button when web renderer url is empty`, async () => {
  register();
  mockCore(true, null);
  mockMessageHandler();
  mockNotifications();
  mockRendererAction();

  loadPlugins();
  const { getByText, queryByText } = render(
    <ArraySlot name="rendererActions" />
  );

  await waitForElement(() => getByText('fooAction'));
  expect(queryByText(/remote/i)).toBeNull();
});

it(`doesn't render button when dev server is off`, async () => {
  register();
  mockCore(false, 'mockWebUrl');
  mockMessageHandler();
  mockNotifications();
  mockRendererAction();

  loadPlugins();
  const { getByText, queryByText } = render(
    <ArraySlot name="rendererActions" />
  );

  await waitForElement(() => getByText('fooAction'));
  expect(queryByText(/remote/i)).toBeNull();
});

it('renders button', async () => {
  register();
  mockCore(true, 'mockWebUrl');
  mockMessageHandler();
  mockNotifications();

  loadPlugins();
  const { getByText } = render(<ArraySlot name="rendererActions" />);

  await waitForElement(() => getByText(/remote/i));
});

it('notifies copy error on button click', async () => {
  register();
  mockCore(true, 'mockWebUrl');
  mockMessageHandler();

  const pushNotification = jest.fn();
  mockNotifications(pushNotification);

  loadPlugins();
  const { getByText } = render(<ArraySlot name="rendererActions" />);

  const button = getByText(/remote/i);
  fireEvent.click(button);

  // Clipboard API isn't available in jsdom so we only test the error path
  await wait(() =>
    expect(pushNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-url-copy',
      type: 'error',
      title: 'Failed to copy renderer URL to clipboard',
      info: 'Make sure your browser supports clipboard operations.'
    })
  );
});
