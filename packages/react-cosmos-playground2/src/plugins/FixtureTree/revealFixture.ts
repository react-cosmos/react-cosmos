import { isEqual } from 'lodash';
import {
  createFixtureTree,
  FixtureTreeNode,
} from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeExpansion } from '../../shared/treeExpansion';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { StorageSpec } from '../Storage/public';
import {
  FixtureTreeContext,
  getTreeExpansion,
  setTreeExpansion,
} from './shared';

export function revealFixture(
  context: FixtureTreeContext,
  fixtureId: FixtureId
) {
  const { getMethodsOf } = context;
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const core = getMethodsOf<CoreSpec>('core');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const { fixturesDir, fixtureFileSuffix } = core.getFixtureFileVars();
  const fixtures = rendererCore.getFixtures();

  const rootFixtureNode = createFixtureTree({
    fixtures,
    fixturesDir,
    fixtureFileSuffix,
  });
  const nodePath = getFixtureDirNodePath(rootFixtureNode, fixtureId);
  if (nodePath) {
    const treeExpansion = getTreeExpansion(storage);
    const curNodePath = [];
    const curTreeExpansion: TreeExpansion = { ...treeExpansion };
    for (let pathIndex = 0; pathIndex < nodePath.length; pathIndex++) {
      curNodePath.push(nodePath[pathIndex]);
      curTreeExpansion[curNodePath.join('/')] = true;
    }
    setTreeExpansion(storage, curTreeExpansion);
  }
}

function getFixtureDirNodePath(
  { data, children }: FixtureTreeNode,
  fixtureId: FixtureId,
  atPath: string[] = []
): null | string[] {
  if (data.type === 'fixture' || !children) return null;

  const childNames = Object.keys(children);
  for (let childName of childNames) {
    const childNode = children[childName];
    if (childNode.data.type === 'fixture') {
      if (isEqual(childNode.data.fixtureId, fixtureId)) return atPath;
    } else {
      const fixtureDirPath = getFixtureDirNodePath(childNode, fixtureId, [
        ...atPath,
        childName,
      ]);
      if (fixtureDirPath) return fixtureDirPath;
    }
  }

  return null;
}
