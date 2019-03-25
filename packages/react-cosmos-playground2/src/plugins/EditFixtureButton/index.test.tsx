import * as React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import {
  render,
  waitForElement,
  fireEvent,
  RenderResult
} from 'react-testing-library';
import { register } from '.';
import { createArrayPlug } from '../../shared/slot';
import { cleanup, mockPlug } from '../../testHelpers/plugin';
import { mockCore, mockRouter } from '../../testHelpers/pluginMocks';
import { mockFetch } from './testHelpers';

afterEach(cleanup);

function mockSelectedFixtureId() {
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo.js', name: null })
  });
}

function mockFixtureAction() {
  mockPlug({
    slotName: 'fixtureActions',
    render: createArrayPlug('fixtureActions', () => <>fooAction</>)
  });
}

function waitForMockFixtureAction({ getByText }: RenderResult) {
  return waitForElement(() => getByText('fooAction'));
}

async function loadTestPlugins() {
  mockSelectedFixtureId();
  mockFixtureAction();
  register();
  loadPlugins();
  const renderer = render(<Slot name="fixtureActions" />);
  await waitForMockFixtureAction(renderer);
  return renderer;
}

it(`doesn't render button when dev server is off`, async () => {
  mockCore({
    isDevServerOn: () => false
  });
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/edit/i)).toBeNull();
});

it('renders button', async () => {
  mockCore({
    isDevServerOn: () => true
  });
  const { getByText } = await loadTestPlugins();
  await waitForElement(() => getByText(/edit/i));
});

it('calls server endpoint on button click', async () => {
  await mockFetch(async fetchMock => {
    mockCore({
      isDevServerOn: () => true
    });
    const { getByText } = await loadTestPlugins();

    const editBtn = await waitForElement(() => getByText(/edit/i));
    fireEvent.click(editBtn);

    const openFileUrl = '/_open?filePath=foo.js';
    expect(fetchMock).toBeCalledWith(openFileUrl, expect.any(Object));
  });
});
