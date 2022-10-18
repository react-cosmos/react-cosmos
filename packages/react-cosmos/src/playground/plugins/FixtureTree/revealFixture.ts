import { FixtureId } from 'react-cosmos-core/fixture';
import {
  createFixtureTree,
  FixtureTreeNode,
} from 'react-cosmos-core/fixtureTree';
import { nodeContainsFixtureId } from '../../shared/fixtureTree';
import { TreeExpansion } from '../../shared/treeExpansion';
import { CoreSpec } from '../Core/spec';
import { RendererCoreSpec } from '../RendererCore/spec';
import { StorageSpec } from '../Storage/spec';
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

  const rootNode = createFixtureTree({
    fixtures,
    fixturesDir,
    fixtureFileSuffix,
  });
  const dirPath = findDirPath(rootNode, fixtureId);
  if (dirPath) {
    const treeExpansion = getTreeExpansion(storage);
    const curDirPath = [];
    const curTreeExpansion: TreeExpansion = { ...treeExpansion };
    for (let pathIndex = 0; pathIndex < dirPath.length; pathIndex++) {
      curDirPath.push(dirPath[pathIndex]);
      curTreeExpansion[curDirPath.join('/')] = true;
    }
    setTreeExpansion(storage, curTreeExpansion);
  }
}

function findDirPath(
  { data, children }: FixtureTreeNode,
  fixtureId: FixtureId,
  parents: string[] = []
): null | string[] {
  if (data.type !== 'fileDir' || !children) return null;

  const childNames = Object.keys(children);
  for (let childName of childNames) {
    const childNode = children[childName];

    if (childNode.data.type !== 'fileDir') {
      if (nodeContainsFixtureId(childNode, fixtureId)) return parents;
    } else {
      const dirPath = findDirPath(childNode, fixtureId, [
        ...parents,
        childName,
      ]);
      if (dirPath) return dirPath;
    }
  }

  return null;
}
