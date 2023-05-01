import React from 'react';
import { FixtureId, FixtureList, createFixtureTree } from 'react-cosmos-core';
import { useValue } from 'react-cosmos-renderer/client';
import { TreeExpansion } from '../../../shared/treeExpansion.js';
import { FixtureTree } from './FixtureTree.js';

const fixtures: FixtureList = {
  'src/Dashboard.ts': { type: 'single' },
  'src/Settings.ts': { type: 'single' },
  'src/shared/Dropdown.ts': { type: 'single' },
  'src/shared/Button.ts': {
    type: 'multi',
    fixtureNames: ['normal', 'disabled'],
  },
};
const rootNode = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture',
});

const disabledFixtureId = { path: 'src/shared/Button.ts', name: 'disabled' };

export default {
  collapsed: createTreeFixture(),
  expanded: createTreeFixture({ shared: true }),
  'selected collapsed': createTreeFixture({}, disabledFixtureId),
  'selected expanded': createTreeFixture({ shared: true }, disabledFixtureId),
};

function createTreeFixture(
  initialTreeExpansion: TreeExpansion = {},
  fixtureId: null | FixtureId = null
) {
  return () => {
    const [selectedFixtureId, setSelectedFixtureId] = useValue(
      'selectedFixtureId',
      { defaultValue: fixtureId }
    );
    const [expansion, setExpansion] = useValue('treeExpansion', {
      defaultValue: initialTreeExpansion,
    });
    return (
      <FixtureTree
        rootNode={rootNode}
        selectedFixtureId={selectedFixtureId}
        selectedRef={{ current: null }}
        expansion={expansion}
        onSelect={setSelectedFixtureId}
        setExpansion={setExpansion}
      />
    );
  };
}
