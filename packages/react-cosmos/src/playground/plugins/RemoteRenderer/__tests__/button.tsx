import { waitFor } from '@testing-library/dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ArraySlot, loadPlugins, resetPlugins } from 'react-plugin';
import {
  mockCore,
  mockMessageHandler,
  mockNotifications,
} from '../../../../ui/plugin/mocks';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="globalAction" />);
}

it(`doesn't render button when web renderer url is empty`, async () => {
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => null,
  });
  mockMessageHandler();
  mockNotifications();

  const { queryByTitle } = loadTestPlugins();
  expect(queryByTitle(/copy remote renderer url/i)).toBeNull();
});

it(`doesn't render button when dev server is off`, async () => {
  mockCore({
    isDevServerOn: () => false,
    getWebRendererUrl: () => 'mockWebUrl',
  });
  mockMessageHandler();
  mockNotifications();

  const { queryByTitle } = loadTestPlugins();
  expect(queryByTitle(/copy remote renderer url/i)).toBeNull();
});

it('renders button', async () => {
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => 'mockWebUrl',
  });
  mockMessageHandler();
  mockNotifications();

  const { getByTitle } = loadTestPlugins();
  getByTitle(/copy remote renderer url/i);
});

it('notifies copy error on button click', async () => {
  mockCore({
    isDevServerOn: () => true,
    getWebRendererUrl: () => 'mockWebUrl',
  });
  mockMessageHandler();
  const { pushTimedNotification } = mockNotifications();

  const { getByTitle } = loadTestPlugins();
  const button = getByTitle(/copy remote renderer url/i);

  // Clipboard API isn't available in jsdom so we only test the error path
  fireEvent.click(button);
  await waitFor(() =>
    expect(pushTimedNotification).toBeCalledWith(expect.any(Object), {
      id: 'renderer-url-copy',
      type: 'error',
      title: 'Failed to copy renderer URL to clipboard',
      info: 'Make sure your browser supports clipboard operations.',
    })
  );
});
