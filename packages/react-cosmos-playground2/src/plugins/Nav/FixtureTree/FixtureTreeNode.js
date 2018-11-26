// @flow

import React, { Component } from 'react';

import type { TreeNode, TreeExpansion } from './shared';

type Props = {
  node: TreeNode<string>,
  parents: string[],
  treeExpansion: TreeExpansion,
  onSelect: (path: string) => mixed,
  onToggleExpansion: (nodePath: string, expanded: boolean) => mixed
};

export class FixtureTreeNode extends Component<Props> {
  render() {
    const {
      node,
      parents,
      treeExpansion,
      onSelect,
      onToggleExpansion
    } = this.props;
    const { values = [], children } = node;
    const childKeys = Object.keys(children);
    const nodePath = getNodePath(parents);
    const isRootNode = parents.length === 0;
    const isExpanded = isRootNode || treeExpansion[nodePath];

    return (
      <>
        {!isRootNode && (
          <li
            style={{
              marginLeft: getLeftMargin(parents.length - 1),
              userSelect: 'none'
            }}
          >
            <span
              onClick={() => {
                onToggleExpansion(nodePath, !isExpanded);
              }}
            >
              {isExpanded ? '🔽' : '▶️'}
              {parents[parents.length - 1]}
            </span>
          </li>
        )}
        {isExpanded && (
          <>
            {values.map(fixturePath => (
              <li
                key={fixturePath}
                style={{ marginLeft: getLeftMargin(parents.length) }}
              >
                <a href="#" onClick={this.createSelectHandler(fixturePath)}>
                  {getCleanFixtureName(fixturePath)}
                </a>
              </li>
            ))}
            {childKeys.map(dir => {
              const nextParents = [...parents, dir];

              return (
                <FixtureTreeNode
                  key={getNodePath(nextParents)}
                  node={children[dir]}
                  parents={nextParents}
                  treeExpansion={treeExpansion}
                  onSelect={onSelect}
                  onToggleExpansion={onToggleExpansion}
                />
              );
            })}
          </>
        )}
      </>
    );
  }

  createSelectHandler = (path: string) => (
    e: SyntheticEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    this.props.onSelect(path);
  };
}

function getLeftMargin(depth) {
  return depth * 12;
}

function getNodePath(nodeParents: string[]) {
  return nodeParents.join('/');
}

function getCleanFixtureName(fixturePath) {
  return fixturePath
    .split('/')
    .pop()
    .replace(/\.(j|t)sx?$/, '');
}
