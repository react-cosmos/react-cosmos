import React from 'react';
import { createPlugin } from 'react-plugin';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { StorageSpec } from '../Storage/public';
import { FixtureTreeContainer } from './FixtureTreeContainer';
import { FixtureTreeSpec } from './public';
import { revealFixture } from './revealFixture';
import { getTreeExpansion, setTreeExpansion } from './shared';

const { namedPlug, register } = createPlugin<FixtureTreeSpec>({
  name: 'fixtureTree',
  methods: {
    revealFixture
  }
});

namedPlug('navRow', 'fixtureTree', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');
  const router = getMethodsOf<RouterSpec>('router');
  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const treeExpansion = getTreeExpansion(storage);
  const setTreeExpansionMemo = React.useCallback(
    (newTreeExpansion: TreeExpansion) =>
      setTreeExpansion(storage, newTreeExpansion),
    [storage]
  );

  return (
    <FixtureTreeContainer
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      fixtures={rendererCore.getFixtures()}
      treeExpansion={treeExpansion}
      selectFixture={router.selectFixture}
      setTreeExpansion={setTreeExpansionMemo}
    />
  );
});

export { register };
