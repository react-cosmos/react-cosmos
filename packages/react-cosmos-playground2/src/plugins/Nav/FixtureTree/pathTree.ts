import { get, set, forEach, mapKeys } from 'lodash';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { FixtureNode, FixtureNodeDirs } from './shared';

export function getPathTree(fixtures: FixtureNamesByPath): FixtureNode {
  const rootNode = getBlankNode();
  Object.keys(fixtures).forEach(fixturePath =>
    addFixturePathToTree(rootNode, fixturePath, fixtures[fixturePath])
  );

  return rootNode;
}

export function collapsePathTreeDirs(
  treeNode: FixtureNode,
  collapsedDirName: string
): FixtureNode {
  let items = { ...treeNode.items };
  const dirs: FixtureNodeDirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    if (dirName !== collapsedDirName) {
      dirs[dirName] = collapsePathTreeDirs(dirNode, collapsedDirName);

      return;
    }

    if (dirNode.items) {
      items = {
        ...items,
        ...dirNode.items
      };
    }

    forEach(dirNode.dirs, (childDirNode, childDirName) => {
      dirs[childDirName] = collapsePathTreeDirs(childDirNode, collapsedDirName);
    });
  });

  return { items, dirs };
}

export function hideFixtureSuffix(
  treeNode: FixtureNode,
  suffix: string
): FixtureNode {
  // The fixture name suffix can be found in both dir and item names
  const dirs = Object.keys(treeNode.dirs).reduce((prev, dirName) => {
    const cleanDirName = removeFixtureNameSuffix(dirName, suffix);
    return {
      ...prev,
      [cleanDirName]: hideFixtureSuffix(treeNode.dirs[dirName], suffix)
    };
  }, {});
  const items = mapKeys(treeNode.items, (fixturePath, fixtureName) =>
    removeFixtureNameSuffix(fixtureName, suffix)
  );

  return { items, dirs };
}

export function collapseSoloIndexes(treeNode: FixtureNode): FixtureNode {
  const containsSoloIndexDir =
    Object.keys(treeNode.dirs).length === 1 && treeNode.dirs.index;

  if (containsSoloIndexDir && Object.keys(treeNode.items).length === 0) {
    const indexDirNode = treeNode.dirs.index;
    return collapseSoloIndexes({
      items: indexDirNode.items,
      dirs: indexDirNode.dirs
    });
  }

  const items = { ...treeNode.items };
  const dirs: FixtureNodeDirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items || {};
    const containsSoloIndexItem =
      Object.keys(dirItems).length === 1 && dirItems.index;

    if (containsSoloIndexItem && !items[dirName]) {
      items[dirName] = dirItems.index;
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { items, dirs };
}

function addFixturePathToTree(
  rootNode: FixtureNode,
  fixturePath: string,
  fixtureNames: null | string[]
) {
  const namespace = fixturePath.split('/');
  const rawFixtureName = namespace.pop();

  if (!rawFixtureName) {
    throw new Error('Fixture name is empty');
  }

  const fileName = removeFixtureNameExtension(rawFixtureName);

  if (!fixtureNames) {
    return addItemToFixtureTree(rootNode, namespace, fileName, {
      path: fixturePath,
      name: null
    });
  }

  fixtureNames.forEach(fixtureName => {
    addItemToFixtureTree(rootNode, [...namespace, fileName], fixtureName, {
      path: fixturePath,
      name: fixtureName
    });
  });
}

function addItemToFixtureTree(
  rootNode: FixtureNode,
  namespace: string[],
  itemName: string,
  fixtureId: FixtureId
) {
  if (namespace.length === 0) {
    rootNode.items[itemName] = fixtureId;
    return;
  }

  let curNodeDepth = 1;
  let curNode: FixtureNode;
  do {
    const partialNamespace = namespace.slice(0, curNodeDepth);
    const partialPath = partialNamespace.map(p => `dirs["${p}"]`).join('.');

    curNode = get(rootNode, partialPath);
    if (!curNode) {
      curNode = getBlankNode();
      set(rootNode, partialPath, curNode);
    }

    curNodeDepth += 1;
  } while (curNodeDepth <= namespace.length);

  curNode.items[itemName] = fixtureId;
}

function getBlankNode(): FixtureNode {
  return {
    items: {},
    dirs: {}
  };
}

function removeFixtureNameExtension(fixtureName: string) {
  return fixtureName.replace(/\.(j|t)sx?$/, '');
}

function removeFixtureNameSuffix(
  fixtureNameWithoutExtension: string,
  suffix: string
) {
  return fixtureNameWithoutExtension.replace(new RegExp(`\\.${suffix}$`), '');
}
