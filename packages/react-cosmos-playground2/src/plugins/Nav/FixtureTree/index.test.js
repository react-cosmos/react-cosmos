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

const projectId = 'mockProjectId';
const fixturesDir = 'fixtures';
const fixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/nested/drei.js'
];
const treeExpansionStorageKey = `${projectId}-treeExpansion`;

it('hides nested fixture', async () => {
  const { queryByText } = render(
    <FixtureTree
      storageApi={{ getItem: jest.fn(), setItem: jest.fn() }}
      projectId={projectId}
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
      projectId={projectId}
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
      projectId={projectId}
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
    [treeExpansionStorageKey]: {
      nested: true
    }
  };

  const { getByText } = render(
    <FixtureTree
      storageApi={{
        getItem: key => Promise.resolve(storage[key]),
        setItem: jest.fn()
      }}
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  await waitForElement(() => getByText('drei'));
});

it('persists tree expansion state', async () => {
  let storage = {
    [treeExpansionStorageKey]: {}
  };

  const { getByText } = render(
    <FixtureTree
      storageApi={{
        getItem: jest.fn(),
        setItem: (key, value) => {
          storage[key] = value;
        }
      }}
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtures={fixtures}
      onSelect={jest.fn()}
    />
  );

  fireEvent.click(getByText(/nested/i));

  await wait(() => expect(storage[treeExpansionStorageKey].nested).toBe(true));
});
