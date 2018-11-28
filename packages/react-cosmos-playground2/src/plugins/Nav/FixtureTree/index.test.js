// @flow

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  wait,
  fireEvent
} from 'react-testing-library';
import { PluginProvider } from '../../../plugin';
import { RegisterMethod } from '../../../testHelpers/RegisterMethod';
import { FixtureTree } from '.';

afterEach(cleanup);

const projectId = 'mockProjectId';
const fixturesDir = 'fixtures';
const fixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/nested/drei.js'
];
const treeExpansionStorageKey = `cosmos-treeExpansion-${projectId}`;

const noopStorageGetItem = (
  <RegisterMethod
    methodName="storage.getItem"
    handler={() => Promise.resolve(null)}
  />
);

const noopStorageSetItem = (
  <RegisterMethod
    methodName="storage.setItem"
    handler={() => Promise.resolve(null)}
  />
);

it('hides nested fixture', async () => {
  const { queryByText } = renderPlayground(
    <>
      {noopStorageGetItem}
      <FixtureTree
        projectId={projectId}
        fixturesDir={fixturesDir}
        fixtures={fixtures}
        onSelect={jest.fn()}
      />
    </>
  );

  await wait(() => expect(queryByText('drei')).toBeNull());
});

it('shows nested fixture upon expanding dir', async () => {
  const { getByText } = renderPlayground(
    <>
      {noopStorageGetItem}
      {noopStorageSetItem}
      <FixtureTree
        projectId={projectId}
        fixturesDir={fixturesDir}
        fixtures={fixtures}
        onSelect={jest.fn()}
      />
    </>
  );

  fireEvent.click(getByText(/nested/i));

  await waitForElement(() => getByText('drei'));
});

it('hides nested fixture upon collapsing dir', async () => {
  const { queryByText, getByText } = renderPlayground(
    <>
      {noopStorageGetItem}
      {noopStorageSetItem}
      <FixtureTree
        projectId={projectId}
        fixturesDir={fixturesDir}
        fixtures={fixtures}
        onSelect={jest.fn()}
      />
    </>
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

  const { getByText } = renderPlayground(
    <>
      <RegisterMethod
        methodName="storage.getItem"
        handler={key => Promise.resolve(storage[key])}
      />
      {noopStorageSetItem}
      <FixtureTree
        projectId={projectId}
        fixturesDir={fixturesDir}
        fixtures={fixtures}
        onSelect={jest.fn()}
      />
    </>
  );

  await waitForElement(() => getByText('drei'));
});

it('persists tree expansion state', async () => {
  let storage = {
    [treeExpansionStorageKey]: {}
  };

  const { getByText } = renderPlayground(
    <>
      {noopStorageGetItem}
      <RegisterMethod
        methodName="storage.setItem"
        handler={(key, value) => Promise.resolve((storage[key] = value))}
      />
      <FixtureTree
        projectId={projectId}
        fixturesDir={fixturesDir}
        fixtures={fixtures}
        onSelect={jest.fn()}
      />
    </>
  );

  fireEvent.click(getByText(/nested/i));

  await wait(() => expect(storage[treeExpansionStorageKey].nested).toBe(true));
});

function renderPlayground(children) {
  return render(<PluginProvider>{children}</PluginProvider>);
}
