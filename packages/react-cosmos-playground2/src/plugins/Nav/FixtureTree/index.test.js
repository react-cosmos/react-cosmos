// @flow

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  wait,
  fireEvent
} from 'react-testing-library';
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
      storageApi={{ getItem: jest.fn(), setItem: jest.fn() }}
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
      storageApi={{ getItem: jest.fn(), setItem: jest.fn() }}
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
      storageApi={{ getItem: jest.fn(), setItem: jest.fn() }}
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  fireEvent.click(getByText(/nested/i));
  fireEvent.click(getByText(/nested/i));

  await wait(() => expect(queryByText('drei')).toBeNull());
});

it('loads persistent tree expansion state', async () => {
  const storage = {
    treeExpansion: {
      nested: true
    }
  };

  const { getByText } = render(
    <FixtureTree
      storageApi={{
        getItem: key => Promise.resolve(storage[key]),
        setItem: jest.fn()
      }}
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  await waitForElement(() => getByText('drei'));
});

it('persists tree expansion state', async () => {
  let storage = {
    treeExpansion: {}
  };

  const { getByText } = render(
    <FixtureTree
      storageApi={{
        getItem: jest.fn(),
        setItem: (key, value) => {
          storage[key] = value;
        }
      }}
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  fireEvent.click(getByText(/nested/i));

  await wait(() => expect(storage.treeExpansion.nested).toBe(true));
});
