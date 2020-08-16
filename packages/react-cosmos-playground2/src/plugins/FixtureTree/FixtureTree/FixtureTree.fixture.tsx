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
    const [
      selectedFixtureId,
      setSelectedFixtureId,
    ] = useValue('selectedFixtureId', { defaultValue: fixtureId });
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
