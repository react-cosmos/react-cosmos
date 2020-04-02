import { isEqual } from 'lodash';
import {
  createFixtureTree,
  FixtureNode
} from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { TreeExpansion } from '../../shared/ui/TreeView';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { StorageSpec } from '../Storage/public';
import {
  FixtureTreeContext,
  getTreeExpansion,
  setTreeExpansion
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
    fixtureFileSuffix
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
  { dirs, items }: FixtureNode,
  fixtureId: FixtureId,
  atPath: string[] = []
): null | string[] {
  const itemNames = Object.keys(items);
  const dirPath = itemNames.find(itemName =>
    isEqual(items[itemName], fixtureId)
  );
  if (dirPath) {
    return atPath;
  }

  const dirNames = Object.keys(dirs);
  for (let dirIndex = 0; dirIndex < dirNames.length; dirIndex++) {
    const dirName = dirNames[dirIndex];
    const childDirPath = getFixtureDirNodePath(dirs[dirName], fixtureId, [
      ...atPath,
      dirName
    ]);
    if (childDirPath) {
      return childDirPath;
    }
  }

  return null;
}
