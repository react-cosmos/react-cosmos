// @flow

import { get, set, forEach, mapValues, mapKeys } from 'lodash';

import type { TreeNode } from './shared';

export function getPathTree(paths: string[]): TreeNode {
  const rootNode = getBlankNode();
  paths.forEach(path => addFixtureToTree(rootNode, path));

  return rootNode;
}

export function collapsePathTreeDirs(
  treeNode: TreeNode,
  collapsedDirName: string
): TreeNode {
  let fixtures = { ...treeNode.fixtures };
  let dirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    if (dirName !== collapsedDirName) {
      dirs[dirName] = collapsePathTreeDirs(dirNode, collapsedDirName);

      return;
    }

    if (dirNode.fixtures) {
      fixtures = {
        ...fixtures,
        ...dirNode.fixtures
      };
    }

    forEach(dirNode.dirs, (childDirNode, childDirName) => {
      dirs[childDirName] = collapsePathTreeDirs(childDirNode, collapsedDirName);
    });
  });

  return { fixtures, dirs };
}

export function hideFixtureSuffix(
  treeNode: TreeNode,
  suffix: string
): TreeNode {
  const dirs = mapValues(treeNode.dirs, dirNode =>
    hideFixtureSuffix(dirNode, suffix)
  );
  const fixtures = mapKeys(treeNode.fixtures, (fixturePath, fixtureName) =>
    removeFixtureNameSuffix(fixtureName, suffix)
  );

  return { fixtures, dirs };
}

export function collapseSoloIndexes(treeNode: TreeNode): TreeNode {
  let fixtures = { ...treeNode.fixtures };
  let dirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirFixtures = dirNode.fixtures || {};
    const containsSoloIndex =
      Object.keys(dirFixtures).length === 1 && dirFixtures.index;

    if (containsSoloIndex) {
      fixtures[dirName] = dirFixtures.index;
    } else {
      dirs[dirName] = collapseSoloIndexes(dirNode);
    }
  });

  return { fixtures, dirs };
}

function addFixtureToTree(rootNode: TreeNode, fixturePath: string) {
  const namespace = fixturePath.split('/');
  const fixtureName = removeFixtureNameExtension(namespace.pop());

  if (namespace.length === 0) {
    rootNode.fixtures[fixtureName] = fixturePath;

    return;
  }

  let curNodeDepth = 1;
  let curNode;
  do {
    const partialNamespace = namespace.slice(0, curNodeDepth);
    const partialPath = partialNamespace.map(p => `dirs.${p}`).join('.');

    curNode = get(rootNode, partialPath);
    if (!curNode) {
      curNode = getBlankNode();
      set(rootNode, partialPath, curNode);
    }

    curNodeDepth += 1;
  } while (curNodeDepth <= namespace.length);

  curNode.fixtures[fixtureName] = fixturePath;
}

function getBlankNode(): TreeNode {
  return {
    fixtures: {},
    dirs: {}
  };
}

function removeFixtureNameExtension(fixtureName) {
  return fixtureName.replace(/\.(j|t)sx?$/, '');
}

function removeFixtureNameSuffix(fixtureNameWithoutExtension, suffix) {
  return fixtureNameWithoutExtension.replace(new RegExp(`\\.${suffix}$`), '');
}
