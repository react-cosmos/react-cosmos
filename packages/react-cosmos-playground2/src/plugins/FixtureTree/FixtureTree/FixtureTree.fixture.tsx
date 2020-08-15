import React from 'react';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { useValue } from 'react-cosmos/fixture';
import { TreeExpansion } from '../../../shared/treeExpansion';
import { FixtureTree } from './FixtureTree';

const fixtures = {
  'src/Dashboard.ts': null,
  'src/Settings.ts': null,
  'src/shared/Dropdown.ts': null,
  'src/shared/Button.ts': ['normal', 'disabled'],
};
const rootNode = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture',
});

const fixtureBId = { path: 'src/dir1/fixture4.ts', name: 'fixtureB' };

export default {
  collapsed: createTreeFixture(),

  expanded1: createTreeFixture({ dir1: true }),

  expanded2: createTreeFixture({ dir1: true, 'dir1/fixture4': true }),

  'selected collapsed': createTreeFixture({}, fixtureBId),

  'selected expanded1': createTreeFixture({ dir1: true }, fixtureBId),

  'selected expanded2': createTreeFixture(
    { dir1: true, 'dir1/fixture4': true },
    fixtureBId
  ),
};

function createTreeFixture(
  initialTreeExpansion: TreeExpansion = {},
  fixtureId: null | FixtureId = null
) {
  return () => {
    const [
      selectedFixtureId,
      setSelectedFixtureId,
    ] = useValue('selectedFixtureId', { defaultValue: fixtureId });
    const [treeExpansion, setTreeExpansion] = useValue('treeExpansion', {
      defaultValue: initialTreeExpansion,
    });
    return (
      <FixtureTree
        rootNode={rootNode}
        selectedFixtureId={selectedFixtureId}
        selectedRef={{ current: null }}
        treeExpansion={treeExpansion}
        onSelect={setSelectedFixtureId}
        setTreeExpansion={setTreeExpansion}
      />
    );
  };
}
