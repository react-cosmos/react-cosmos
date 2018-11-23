// @flow

import React, { Component } from 'react';

import type { TreeNode } from './shared';

type Props = {
  node: TreeNode<string>,
  parents: string[],
  onSelect: (path: string) => mixed
};

export class FixtureTreeNode extends Component<Props> {
  render() {
    const { node, parents, onSelect } = this.props;
    const { values = [], children } = node;
    const childDirs = Object.keys(children);

    return (
      <>
        {parents.length > 0 && (
          <li
            key={parents.join('/')}
            style={{ marginLeft: getLeftMargin(parents.length - 1) }}
          >
            {parents[parents.length - 1]}
          </li>
        )}
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
        {childDirs.map(dir => {
          const nextParents = [...parents, dir];

          return (
            <FixtureTreeNode
              key={nextParents.join('.')}
              node={children[dir]}
              parents={nextParents}
              onSelect={onSelect}
            />
          );
        })}
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

function getCleanFixtureName(fixturePath) {
  return fixturePath
    .split('/')
    .pop()
    .replace(/\.(j|t)sx?$/, '');
}
