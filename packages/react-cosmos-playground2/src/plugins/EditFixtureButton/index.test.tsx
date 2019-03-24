import * as React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { render, waitForElement, fireEvent } from 'react-testing-library';
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

async function loadTestPlugins() {
  mockFixtureAction();
  register();
  loadPlugins();
  const renderer = render(<Slot name="fixtureActions" />);

  // Wait for the mock button to render before running assertions
  await waitForElement(() => renderer.getByText('fooAction'));

  return renderer;
}

it(`doesn't render button when dev server is off`, async () => {
  mockCore({
    isDevServerOn: () => false
  });
  mockSelectedFixtureId();
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/edit/i)).toBeNull();
});

it('renders button', async () => {
  mockCore({
    isDevServerOn: () => true
  });
  mockSelectedFixtureId();
  const { getByText } = await loadTestPlugins();
  await waitForElement(() => getByText(/edit/i));
});

it('calls server endpoint on button click', async () => {
  await mockFetch(async fetchMock => {
    mockCore({
      isDevServerOn: () => true
    });
    mockSelectedFixtureId();
    const { getByText } = await loadTestPlugins();

    const editBtn = await waitForElement(() => getByText(/edit/i));
    fireEvent.click(editBtn);

    const openFileUrl = '/_open?filePath=foo.js';
    expect(fetchMock).toBeCalledWith(openFileUrl, expect.any(Object));
  });
});
