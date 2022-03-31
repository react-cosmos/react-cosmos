import React, { useCallback } from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../../../ui/specs/CoreSpec';
import { FixtureTreeSpec } from '../../../ui/specs/FixtureTreeSpec';
import { RendererCoreSpec } from '../../../ui/specs/RendererCoreSpec';
import { RouterSpec } from '../../../ui/specs/RouterSpec';
import { StorageSpec } from '../../../ui/specs/StorageSpec';
import { TreeExpansion } from '../../shared/treeExpansion';
import { FixtureTreeContainer } from './FixtureTreeContainer';
import { revealFixture } from './revealFixture';
import { getTreeExpansion, setTreeExpansion } from './shared';

const { namedPlug, register } = createPlugin<FixtureTreeSpec>({
  name: 'fixtureTree',
  methods: {
    revealFixture,
  },
});

namedPlug('navRow', 'fixtureTree', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const storage = pluginContext.getMethodsOf<StorageSpec>('storage');
  const router = getMethodsOf<RouterSpec>('router');
  const core = getMethodsOf<CoreSpec>('core');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const expansion = getTreeExpansion(storage);
  const setExpansionMemo = useCallback(
    (newExpansion: TreeExpansion) => setTreeExpansion(storage, newExpansion),
    [storage]
  );

  return (
    <FixtureTreeContainer
      fixturesDir={fixturesDir}
      fixtureFileSuffix={fixtureFileSuffix}
      selectedFixtureId={router.getSelectedFixtureId()}
      rendererConnected={rendererCore.isRendererConnected()}
      fixtures={rendererCore.getFixtures()}
      expansion={expansion}
      selectFixture={router.selectFixture}
      setExpansion={setExpansionMemo}
    />
  );
});

register();
