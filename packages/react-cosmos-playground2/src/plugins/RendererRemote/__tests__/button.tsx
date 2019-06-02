import React from 'react';
import { loadPlugins, ArraySlot } from 'react-plugin';
import { render, waitForElement, fireEvent, wait } from 'react-testing-library';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import {
  mockCore,
  mockMessageHandler,
  mockNotifications
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function mockRendererAction() {
  mockPlug('rendererActions', () => <>fooAction</>);
}

it(`doesn't render button when web renderer url is empty`, async () => {
  register();
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => null
  });
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
  mockCore({
    isDevServerOn: () => false,
    getWebRendererUrl: () => 'mockWebUrl'
  });
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
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => 'mockWebUrl'
  });
  mockMessageHandler();
  mockNotifications();

  loadPlugins();
  const { getByText } = render(<ArraySlot name="rendererActions" />);

  await waitForElement(() => getByText(/remote/i));
});

it('notifies copy error on button click', async () => {
  register();
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => 'mockWebUrl'
  });
  mockMessageHandler();
  const { pushTimedNotification } = mockNotifications();

  loadPlugins();
  const { getByText } = render(<ArraySlot name="rendererActions" />);

  const button = getByText(/remote/i);
  fireEvent.click(button);

  // Clipboard API isn't available in jsdom so we only test the error path
  await wait(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-url-copy',
      type: 'error',
      title: 'Failed to copy renderer URL to clipboard',
      info: 'Make sure your browser supports clipboard operations.'
    })
  );
});
