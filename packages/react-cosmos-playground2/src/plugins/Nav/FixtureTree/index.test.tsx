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

const fixturesDir = 'fixtures';
const fixtureFileSuffix = 'fixture';
const fixtures = {
  'ein.js': null,
  'zwei.js': null,
  'nested/drei.js': null,
  'deeply/nested/vier.js': null
};

it('hides fixture under non-expanded dir', async () => {
  const { queryByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      treeExpansion={{}}
      onSelect={jest.fn()}
      setTreeExpansion={jest.fn()}
    />
  );
  await wait(() => expect(queryByText('drei')).toBeNull());
});

it('shows fixture under expanded dir', async () => {
  const { getByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      treeExpansion={{ nested: true }}
      onSelect={jest.fn()}
      setTreeExpansion={jest.fn()}
    />
  );
  await waitForElement(() => getByText('drei'));
});

it('expands hidden dir on click', async () => {
  const setTreeExpansion = jest.fn();
  const { getByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      treeExpansion={{}}
      onSelect={jest.fn()}
      setTreeExpansion={setTreeExpansion}
    />
  );
  fireEvent.click(getByText(/nested/i));
  expect(setTreeExpansion).toBeCalledWith({ nested: true });
});

it('collapses expanded dir on click', async () => {
  const setTreeExpansion = jest.fn();
  const { getByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      treeExpansion={{ nested: true }}
      onSelect={jest.fn()}
      setTreeExpansion={setTreeExpansion}
    />
  );
  fireEvent.click(getByText(/nested/i));
  expect(setTreeExpansion).toBeCalledWith({ nested: false });
});
