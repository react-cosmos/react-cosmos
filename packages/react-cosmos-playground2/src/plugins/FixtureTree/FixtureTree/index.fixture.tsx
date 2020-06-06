import React from 'react';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { useValue } from 'react-cosmos/fixture';
import { FixtureTree } from '.';
import { TreeExpansion } from '../../../shared/TreeView';

const fixtures = {
  'src/fixture1.ts': null,
  'src/fixture2.ts': null,
  'src/dir1/fixture3.ts': null,
  'src/dir1/fixture4.ts': ['fixtureA', 'fixtureB'],
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
