import * as React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { render, waitForElement } from 'react-testing-library';
import { register } from '.';
import { createArrayPlug } from '../../shared/slot';
import { cleanup, mockPlug } from '../../testHelpers/plugin';
import { mockCore } from '../../testHelpers/pluginMocks';

afterEach(cleanup);

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

// TODO: calls server endpoint on button click
