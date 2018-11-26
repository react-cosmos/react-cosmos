// @flow

import { get, set, forEach } from 'lodash';

import type { TreeNode } from './shared';

export function getPathTree(paths: string[]): TreeNode<string> {
  const tree = getBlankNode();

  paths.forEach(path => {
    const namespace = path.split('/');
    namespace.pop();

    const nodePath = namespace.map(p => `children.${p}`).join('.');
    const node = get(tree, nodePath) || getBlankNode();

    const { children, values = [] } = node;
    set(tree, nodePath, {
      children,
      values: [...values, path]
    });
  });

  return tree;
}

export function collapsePathTreeDirs(
  treeNode: TreeNode<string>,
  collapsedDirName: string
): TreeNode<string> {
  let values = treeNode.values ? [...treeNode.values] : [];
  let children = {};

  forEach(treeNode.children, (childNode, childDir) => {
    if (childDir !== collapsedDirName) {
      children = {
        ...children,
        [childDir]: collapsePathTreeDirs(childNode, collapsedDirName)
      };

      return;
    }

    if (childNode.values) {
      values.push(...childNode.values);
    }

    forEach(childNode.children, (gchildNode, gchildDir) => {
      children[gchildDir] = collapsePathTreeDirs(gchildNode, collapsedDirName);
    });
  });

  return values.length > 0 ? { values, children } : { children };
}

function getBlankNode() {
  return {
    values: [],
    children: {}
  };
}
