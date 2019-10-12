import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { useValue } from 'react-cosmos/runtime';
import { FixtureTree } from '.';
import { TreeExpansion } from '../../../shared/ui/TreeView';

const fixtures = {
  'src/fixture1.ts': null,
  'src/fixture2.ts': null,
  'src/dir1/fixture3.ts': null,
  'src/dir1/fixture4.ts': ['fixtureA', 'fixtureB']
};

const fixtureBId = { path: 'src/dir1/fixture4.ts', name: 'fixtureB' };

export default {
  collapsed: createFixtureTree(),

  expanded1: createFixtureTree({ dir1: true }),

  expanded2: createFixtureTree({ dir1: true, 'dir1/fixture4': true }),

  'selected collapsed': createFixtureTree({}, fixtureBId),

  'selected expanded1': createFixtureTree({ dir1: true }, fixtureBId),

  'selected expanded2': createFixtureTree(
    { dir1: true, 'dir1/fixture4': true },
    fixtureBId
  )
};

function createFixtureTree(
  initialTreeExpansion: TreeExpansion = {},
  fixtureId: null | FixtureId = null
) {
  return () => {
    const [selectedFixtureId, setSelectedFixtureId] = useValue(
      'selectedFixtureId',
      { defaultValue: fixtureId }
    );
    const [treeExpansion, setTreeExpansion] = useValue('treeExpansion', {
      defaultValue: initialTreeExpansion
    });
    return (
      <FixtureTree
        fixturesDir="__fixtures__"
        fixtureFileSuffix="fixture"
        fixtures={fixtures}
        selectedFixtureId={selectedFixtureId}
        treeExpansion={treeExpansion}
        onSelect={setSelectedFixtureId}
        setTreeExpansion={setTreeExpansion}
      />
    );
  };
}
