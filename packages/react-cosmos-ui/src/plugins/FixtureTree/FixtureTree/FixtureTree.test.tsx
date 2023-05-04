import { waitFor } from '@testing-library/dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { FixtureList, createFixtureTree } from 'react-cosmos-core';
import { FixtureTree } from './FixtureTree.js';

const fixtures: FixtureList = {
  'ein.js': { type: 'single' },
  'zwei.js': { type: 'single' },
  'nested/drei.js': { type: 'single' },
  'deeply/nested/vier.js': { type: 'single' },
  'fuenf.js': {
    type: 'multi',
    fixtureNames: ['fuenfA', 'fuenfB', 'fuenfC'],
  },
};
const rootNode = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture',
});

it('hides fixture under non-expanded dir', async () => {
  const { queryByText } = render(
    <FixtureTree
      rootNode={rootNode}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
      expansion={{}}
      onSelect={jest.fn()}
      setExpansion={jest.fn()}
    />
  );
  await waitFor(() => expect(queryByText('drei')).toBeNull());
});

it('shows fixture under expanded dir', async () => {
  const { findByText } = render(
    <FixtureTree
      rootNode={rootNode}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
      expansion={{ nested: true }}
      onSelect={jest.fn()}
      setExpansion={jest.fn()}
    />
  );
  await findByText('drei');
});

it('expands hidden dir on click', async () => {
  const setExpansion = jest.fn();
  const { getByText } = render(
    <FixtureTree
      rootNode={rootNode}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
      expansion={{}}
      onSelect={jest.fn()}
      setExpansion={setExpansion}
    />
  );
  fireEvent.click(getByText(/nested/i));
  expect(setExpansion).toBeCalledWith({ nested: true });
});

it('collapses expanded dir on click', async () => {
  const setExpansion = jest.fn();
  const { getByText } = render(
    <FixtureTree
      rootNode={rootNode}
      selectedFixtureId={null}
      selectedRef={{ current: null }}
      expansion={{ nested: true }}
      onSelect={jest.fn()}
      setExpansion={setExpansion}
    />
  );
  fireEvent.click(getByText(/nested/i));
  expect(setExpansion).toBeCalledWith({ nested: false });
});

it('shows named fixture when multi fixture is selected', async () => {
  const { findByText } = render(
    <FixtureTree
      rootNode={rootNode}
      selectedFixtureId={{ path: 'fuenf.js', name: 'fuenfB' }}
      selectedRef={{ current: null }}
      expansion={{}}
      onSelect={jest.fn()}
      setExpansion={jest.fn()}
    />
  );
  await findByText('fuenfB');
});

it('shows first named fixture when multi fixture path is selected', async () => {
  const { findByText } = render(
    <FixtureTree
      rootNode={rootNode}
      selectedFixtureId={{ path: 'fuenf.js' }}
      selectedRef={{ current: null }}
      expansion={{}}
      onSelect={jest.fn()}
      setExpansion={jest.fn()}
    />
  );
  await findByText('fuenfA');
});
