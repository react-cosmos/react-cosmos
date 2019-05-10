import * as React from 'react';
import { loadPlugins, ArraySlot, MethodHandlers } from 'react-plugin';
import { render, waitForElement, fireEvent, wait } from 'react-testing-library';
import { cleanup, mockMethodsOf, mockPlug } from '../../../testHelpers/plugin';
import { CoreSpec } from '../../Core/public';
import { NotificationsSpec } from '../../Notifications/public';
import { register } from '..';

afterEach(cleanup);

function mockCore(devServerOn: boolean, webRendererUrl: null | string) {
  mockMethodsOf<CoreSpec>('core', {
    isDevServerOn: () => devServerOn,
    getWebRendererUrl: () => webRendererUrl
  });
}

type PushNotification = MethodHandlers<NotificationsSpec>['pushNotification'];

function mockNotifications(pushNotification: PushNotification = () => {}) {
  mockMethodsOf<NotificationsSpec>('notifications', {
    pushNotification
  });
}

function mockRendererAction() {
  mockPlug('rendererActions', () => <>fooAction</>);
}

it(`doesn't render button when web renderer url is empty`, async () => {
  register();
  mockCore(true, null);
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
  mockNotifications();

  loadPlugins();
  const { getByText } = render(<ArraySlot name="rendererActions" />);

  await waitForElement(() => getByText(/remote/i));
});

it('notifies copy error on button click', async () => {
  register();
  mockCore(true, 'mockWebUrl');

  const pushNotification = jest.fn();
  mockNotifications(pushNotification);

  loadPlugins();
  const { getByText } = render(<ArraySlot name="rendererActions" />);

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
