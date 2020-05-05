import { waitFor } from '@testing-library/dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { FixtureTree } from '.';

const fixturesDir = 'fixtures';
const fixtureFileSuffix = 'fixture';
const fixtures = {
  'ein.js': null,
  'zwei.js': null,
  'nested/drei.js': null,
  'deeply/nested/vier.js': null,
};

it('hides fixture under non-expanded dir', async () => {
  const { queryByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
      treeExpansion={{}}
      onSelect={jest.fn()}
      setTreeExpansion={jest.fn()}
    />
  );
  await waitFor(() => expect(queryByText('drei')).toBeNull());
});

it('shows fixture under expanded dir', async () => {
  const { findByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
      treeExpansion={{ nested: true }}
      onSelect={jest.fn()}
      setTreeExpansion={jest.fn()}
    />
  );
  await findByText('drei');
});

it('expands hidden dir on click', async () => {
  const setTreeExpansion = jest.fn();
  const { getByText } = render(
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
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
      selectedRef={{ current: null }}
      treeExpansion={{ nested: true }}
      onSelect={jest.fn()}
      setTreeExpansion={setTreeExpansion}
    />
  );
  fireEvent.click(getByText(/nested/i));
  expect(setTreeExpansion).toBeCalledWith({ nested: false });
});
