import { fireEvent, render, waitForElement } from '@testing-library/react';
import React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { register } from '.';
import { cleanup } from '../../testHelpers/plugin';
import {
  mockCore,
  mockRendererCore,
  mockRouter
} from '../../testHelpers/pluginMocks';

afterEach(cleanup);

const fixtures = {
  'src/__fixtures__/fixture1.ts': null,
  'src/__fixtures__/fixture2.ts': null,
  'src/foobar/fixture3.fixture.ts': ['fixture3a', 'fixture3b']
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

it('open fixture list and select fixture', async () => {
  const { selectFixture } = mockRouter();
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  // Opens fixture search overlay
  fireEvent.click(getByText(/search fixtures/i));

  // Shows (cleaned up) fixture list
  await waitForElement(() => getByText('src/fixture1'));
  await waitForElement(() => getByText('src/fixture2'));
  await waitForElement(() => getByText('src/foobar/fixture3 fixture3a'));
  await waitForElement(() => getByText('src/foobar/fixture3 fixture3b'));

  // Selects fixture
  fireEvent.click(getByText('src/foobar/fixture3 fixture3b'));
  const fixtureId = {
    path: 'src/foobar/fixture3.fixture.ts',
    name: 'fixture3b'
  };
  expect(selectFixture).toBeCalledWith(expect.any(Object), fixtureId, false);
});
