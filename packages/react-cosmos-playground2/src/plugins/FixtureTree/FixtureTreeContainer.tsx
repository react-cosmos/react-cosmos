import React from 'react';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { BlankState } from './BlankState';
import { FixtureTree } from './FixtureTree';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  treeExpansion: TreeExpansion;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  setTreeExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function FixtureTreeContainer({
  fixturesDir,
  fixtureFileSuffix,
  selectedFixtureId,
  rendererConnected,
  fixtures,
  treeExpansion,
  selectFixture,
  setTreeExpansion
}: Props) {
  const onSelect = React.useCallback(
    fixtureId => selectFixture(fixtureId, false),
    [selectFixture]
  );

  if (!rendererConnected) {
    return null;
  }

  if (Object.keys(fixtures).length === 0) {
    return (
      <BlankState
        fixturesDir={fixturesDir}
        fixtureFileSuffix={fixtureFileSuffix}
      />
    );
  }

  return (
    <FixtureTree
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      fixtures={fixtures}
      selectedFixtureId={selectedFixtureId}
      treeExpansion={treeExpansion}
      onSelect={onSelect}
      setTreeExpansion={setTreeExpansion}
    />
  );
}
