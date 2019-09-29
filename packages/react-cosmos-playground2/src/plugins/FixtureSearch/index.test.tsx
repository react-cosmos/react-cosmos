import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '.';
import {
  mockCore,
  mockFixtureTree,
  mockRendererCore,
  mockRouter
} from '../../testHelpers/pluginMocks';

afterEach(resetPlugins);

const fixtures = {
  'src/__fixtures__/fixture1.ts': null,
  'src/__fixtures__/fixture2.ts': null,
  'src/foobar/index.fixture.ts': ['fixture3a', 'fixture3b']
};

function registerTestPlugins() {
  register();
  mockCore({
    getFixtureFileVars: () => ({
      fixturesDir: '__fixtures__',
      fixtureFileSuffix: 'fixture'
    })
  });
  mockRendererCore({
    getFixtures: () => fixtures
  });
  mockFixtureTree();
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <>
      <Slot name="navRow" />
      <Slot name="global" />
    </>
  );
}

it('open fixture list and selects fixture', async () => {
  const { selectFixture } = mockRouter();
  registerTestPlugins();
  const { getByText, getByTestId, queryByTestId } = loadTestPlugins();

  // Opens fixture search overlay
  fireEvent.click(getByText(/search fixtures/i));

  // Shows (cleaned up) fixture list
  getByTestId('fixtureSearchContent');
  getByText('fixture1');
  getByText('fixture2');
  getByText('foobar fixture3a');
  getByText('foobar fixture3b');

  // Selects fixture
  fireEvent.click(getByText('foobar fixture3b'));
  const fixtureId = {
    path: 'src/foobar/index.fixture.ts',
    name: 'fixture3b'
  };
  expect(selectFixture).toBeCalledWith(expect.any(Object), fixtureId, false);

  // Also closes fixture search overlay
  expect(queryByTestId('fixtureSearchContent')).toBeNull();
});

it('closes fixture list on outside click', async () => {
  mockRouter();
  registerTestPlugins();
  const { getByText, getByTestId, queryByTestId } = loadTestPlugins();

  // Opens fixture search overlay
  fireEvent.click(getByText(/search fixtures/i));
  getByTestId('fixtureSearchContent');

  // Closes fixture search overlay
  fireEvent.click(getByTestId('fixtureSearchOverlay'));
  expect(queryByTestId('fixtureSearchContent')).toBeNull();
});

it('filters fixture list', async () => {
  mockRouter();
  registerTestPlugins();
  const { getByText, queryByText, getByPlaceholderText } = loadTestPlugins();

  // Opens fixture search overlay
  fireEvent.click(getByText(/search fixtures/i));

  // Filter fixtures
  fireEvent.change(getByPlaceholderText('Fixture search'), {
    target: { value: 'foobar' }
  });

  // Shows only matching fixtures
  expect(queryByText('fixture1')).toBeNull();
  expect(queryByText('fixture2')).toBeNull();
  getByText('foobar fixture3a');
  getByText('foobar fixture3b');
});
