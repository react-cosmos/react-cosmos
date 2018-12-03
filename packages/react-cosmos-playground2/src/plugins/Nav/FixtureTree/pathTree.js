// @flow

import { get, set, forEach } from 'lodash';

import type { TreeNode } from './shared';

export function getPathTree(paths: string[]): TreeNode {
  const tree = getBlankNode();

  paths.forEach(path => {
    const namespace = path.split('/');
    namespace.pop();

    const nodePath = namespace.map(p => `dirs.${p}`).join('.');
    const node = get(tree, nodePath) || getBlankNode();

    const { dirs, fixtures = [] } = node;
    set(tree, nodePath, {
      dirs,
      fixtures: [...fixtures, path]
    });
  });

  return tree;
}

export function collapsePathTreeDirs(
  treeNode: TreeNode,
  collapsedDirName: string
): TreeNode {
  let fixtures = treeNode.fixtures ? [...treeNode.fixtures] : [];
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
      fixtures.push(...dirNode.fixtures);
    }

    forEach(dirNode.dirs, (childDirNode, childDirName) => {
      dirs[childDirName] = collapsePathTreeDirs(childDirNode, collapsedDirName);
    });
  });

  return fixtures.length > 0 ? { fixtures, dirs } : { dirs };
}

function getBlankNode(): TreeNode {
  return {
    fixtures: [],
    dirs: {}
  };
}
