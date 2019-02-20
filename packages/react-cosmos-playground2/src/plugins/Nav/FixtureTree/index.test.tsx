import * as React from 'react';
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
const fixtureFileSuffix = 'fixture';
const fixtures = { 'ein.js': null, 'zwei.js': null, 'nested/drei.js': null };
const treeExpansionStorageKey = `cosmos-treeExpansion-${projectId}`;

it('hides nested fixture', async () => {
  const { queryByText } = render(
    <FixtureTree
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      onSelect={jest.fn()}
      storage={{
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(undefined)
      }}
    />
  );

  await wait(() => expect(queryByText('drei')).toBeNull());
});

it('shows nested fixture upon expanding dir', async () => {
  const { getByText } = render(
    <FixtureTree
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      onSelect={jest.fn()}
      storage={{
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(undefined)
      }}
    />
  );

  fireEvent.click(getByText(/nested/i));

  await waitForElement(() => getByText('drei'));
});

it('hides nested fixture upon collapsing dir', async () => {
  const { queryByText, getByText } = render(
    <FixtureTree
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      onSelect={jest.fn()}
      storage={{
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve(undefined)
      }}
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
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      onSelect={jest.fn()}
      storage={{
        getItem: key => Promise.resolve(storage[key]),
        setItem: () => Promise.resolve(undefined)
      }}
    />
  );

  await waitForElement(() => getByText('drei'));
});

it('persists tree expansion state', async () => {
  type Storage = { [attr: string]: Storage };
  const storage: Storage = {
    [treeExpansionStorageKey]: {}
  };

  const { getByText } = render(
    <FixtureTree
      projectId={projectId}
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      onSelect={jest.fn()}
      storage={{
        getItem: () => Promise.resolve(null),
        setItem: (key, value) => Promise.resolve((storage[key] = value))
      }}
    />
  );

  fireEvent.click(getByText(/nested/i));

  await wait(() => expect(storage[treeExpansionStorageKey].nested).toBe(true));
});
