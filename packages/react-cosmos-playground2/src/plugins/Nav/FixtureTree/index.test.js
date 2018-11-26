// @flow

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  wait,
  fireEvent
} from 'react-testing-library';
import { StateMock } from '@react-mock/state';
import { FixtureTree } from '.';

afterEach(cleanup);

const fixturesDir = 'fixtures';
const fixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/nested/drei.js'
];

it('hides nested fixture', async () => {
  const { queryByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  await wait(() => expect(queryByText('drei')).toBeNull());
});

it('shows nested fixture upon expanding dir', async () => {
  const { getByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  fireEvent.click(getByText(/nested/i));

  await waitForElement(() => getByText('drei'));
});

it('hides nested fixture upon collapsing dir', async () => {
  const { queryByText, getByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  fireEvent.click(getByText(/nested/i));
  fireEvent.click(getByText(/nested/i));

  await wait(() => expect(queryByText('drei')).toBeNull());
});

it('shows nested fixture when dir is already expanded', async () => {
  const { getByText } = render(
    // TODO: Move this to persistent storage
    <StateMock
      state={{
        treeExpansion: {
          nested: true
        }
      }}
    >
      <FixtureTree
        fixturesDir={fixturesDir}
        fixtures={fixtures}
        onSelect={jest.fn()}
      />
    </StateMock>
  );

  await waitForElement(() => getByText('drei'));
});
