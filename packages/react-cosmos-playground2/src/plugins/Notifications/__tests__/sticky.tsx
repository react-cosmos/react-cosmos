import { act, render } from '@testing-library/react';
import React from 'react';
import { getNotificationsMethods } from 'react-cosmos-shared2/ui';
import { ArraySlot, loadPlugins, resetPlugins } from 'react-plugin';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(<ArraySlot name="global" />);
}

function pushStickyNotification() {
  act(() =>
    getNotificationsMethods().pushStickyNotification({
      id: 'build',
      type: 'loading',
      title: 'Rebuilding...',
      info: 'Your code is updating.',
    })
  );
}

it('renders sticky notification', async () => {
  const { getByText } = loadTestPlugins();

  pushStickyNotification();
  getByText('Rebuilding...');
});

it('removes sticky notification', async () => {
  const { getByText, queryByText } = loadTestPlugins();

  pushStickyNotification();
  getByText('Rebuilding...');

  act(() => getNotificationsMethods().removeStickyNotification('build'));
  expect(queryByText('Rebuilding...')).toBeNull();
});
