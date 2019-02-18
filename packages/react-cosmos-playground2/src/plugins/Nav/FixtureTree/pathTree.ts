import { get, set, forEach, mapKeys } from 'lodash';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { FixtureTreeNode, FixtureTreeNodeDirs } from './shared';

export function getPathTree(fixtures: FixtureNamesByPath): FixtureTreeNode {
  const rootNode = getBlankNode();
  Object.keys(fixtures).forEach(fixturePath =>
    addFixturePathToTree(rootNode, fixturePath, fixtures[fixturePath])
  );

  return rootNode;
}

export function collapsePathTreeDirs(
  treeNode: FixtureTreeNode,
  collapsedDirName: string
): FixtureTreeNode {
  let items = { ...treeNode.items };
  const dirs: FixtureTreeNodeDirs = {};

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
  treeNode: FixtureTreeNode,
  suffix: string
): FixtureTreeNode {
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

export function collapseSoloIndexes(
  treeNode: FixtureTreeNode
): FixtureTreeNode {
  const containsSoloIndexDir =
    Object.keys(treeNode.dirs).length === 1 && treeNode.dirs.index;

  if (containsSoloIndexDir) {
    const indexDirNode = treeNode.dirs.index;
    return collapseSoloIndexes({
      // Warning: Items can disappear here because of name collisions
      items: { ...treeNode.items, ...indexDirNode.items },
      dirs: indexDirNode.dirs
    });
  }

  const items = { ...treeNode.items };
  const dirs: FixtureTreeNodeDirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirItems = dirNode.items || {};
    const containsSoloIndexItem =
      Object.keys(dirItems).length === 1 && dirItems.index;

    if (containsSoloIndexItem) {
      items[dirName] = dirItems.index;
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { items, dirs };
}

function addFixturePathToTree(
  rootNode: FixtureTreeNode,
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
  rootNode: FixtureTreeNode,
  namespace: string[],
  itemName: string,
  fixtureId: FixtureId
) {
  if (namespace.length === 0) {
    rootNode.items[itemName] = fixtureId;
    return;
  }

  let curNodeDepth = 1;
  let curNode: FixtureTreeNode;
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

function getBlankNode(): FixtureTreeNode {
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
