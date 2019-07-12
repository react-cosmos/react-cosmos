import React from 'react';
import { loadPlugins, ArraySlot } from 'react-plugin';
import { render, fireEvent, wait } from '@testing-library/react';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockCore,
  mockMessageHandler,
  mockNotifications
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function lostTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="rendererAction" />);
}

it(`doesn't render button when web renderer url is empty`, async () => {
  register();
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => null
  });
  mockMessageHandler();
  mockNotifications();

  const { queryByTitle } = lostTestPlugins();
  expect(queryByTitle(/copy remote renderer url/i)).toBeNull();
});

it(`doesn't render button when dev server is off`, async () => {
  register();
  mockCore({
    isDevServerOn: () => false,
    getWebRendererUrl: () => 'mockWebUrl'
  });
  mockMessageHandler();
  mockNotifications();

  const { queryByTitle } = lostTestPlugins();
  expect(queryByTitle(/copy remote renderer url/i)).toBeNull();
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
  const { getByTitle } = render(<ArraySlot name="rendererAction" />);

  getByTitle(/copy remote renderer url/i);
});

it('notifies copy error on button click', async () => {
  register();
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => 'mockWebUrl'
  });
  mockMessageHandler();
  const { pushTimedNotification } = mockNotifications();

  const { getByTitle } = lostTestPlugins();
  const button = getByTitle(/copy remote renderer url/i);

  // Clipboard API isn't available in jsdom so we only test the error path
  fireEvent.click(button);
  await wait(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-url-copy',
      type: 'error',
      title: 'Failed to copy renderer URL to clipboard',
      info: 'Make sure your browser supports clipboard operations.'
    })
  );
});
