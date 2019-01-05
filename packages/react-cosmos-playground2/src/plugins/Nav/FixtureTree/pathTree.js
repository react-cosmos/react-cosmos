// @flow

import { get, set, forEach, mapValues, mapKeys } from 'lodash';

import type { TreeNode } from './shared';

export function getPathTree(paths: string[]): TreeNode {
  const tree = getBlankNode();

  paths.forEach(path => {
    const namespace = path.split('/');
    namespace.pop();

    const nodePath = namespace.map(p => `dirs.${p}`).join('.');
    const node = get(tree, nodePath) || getBlankNode();

    const { dirs, fixtures = {} } = node;
    set(tree, nodePath, {
      dirs,
      fixtures: { ...fixtures, [getCleanFixtureName(path)]: path }
    });
  });

  return tree;
}

export function collapsePathTreeDirs(
  treeNode: TreeNode,
  collapsedDirName: string
): TreeNode {
  let fixtures = treeNode.fixtures ? { ...treeNode.fixtures } : {};
  let dirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    if (dirName !== collapsedDirName) {
      dirs = {
        ...dirs,
        [dirName]: collapsePathTreeDirs(dirNode, collapsedDirName)
      };

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

  return Object.keys(fixtures).length > 0 ? { fixtures, dirs } : { dirs };
}

export function hideFixtureSuffix(
  treeNode: TreeNode,
  suffix: string
): TreeNode {
  const dirs = mapValues(treeNode.dirs, dirNode =>
    hideFixtureSuffix(dirNode, suffix)
  );

  if (!treeNode.fixtures) {
    return { dirs };
  }

  return {
    fixtures: mapKeys(treeNode.fixtures, (fixturePath, fixtureName) =>
      fixtureName.replace(`.${suffix}`, '')
    ),
    dirs
  };
}

export function collapseSoloIndexes(treeNode: TreeNode) {
  let fixtures = treeNode.fixtures ? { ...treeNode.fixtures } : {};
  let dirs = {};

  forEach(treeNode.dirs, (dirNode, dirName) => {
    const dirFixtures = dirNode.fixtures || {};
    const containsSoloIndex =
      Object.keys(dirFixtures).length === 1 && dirFixtures.index;

    if (containsSoloIndex) {
      fixtures = {
        ...fixtures,
        [dirName]: dirFixtures.index
      };
    } else {
      dirs = {
        ...dirs,
        [dirName]: collapseSoloIndexes(dirNode)
      };
    }
  });

  return Object.keys(fixtures).length > 0 ? { fixtures, dirs } : { dirs };
}

function getBlankNode(): TreeNode {
  return {
    dirs: {}
  };
}

function getCleanFixtureName(fixturePath) {
  return fixturePath
    .split('/')
    .pop()
    .replace(/\.(j|t)sx?$/, '');
}
