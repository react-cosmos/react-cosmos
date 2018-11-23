// @flow

import { get, set } from 'lodash';
import React, { Component } from 'react';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';

type TreeNode<T> = {
  values?: T[],
  children: {
    [dir: string]: TreeNode<T>
  }
};

type Props = {
  fixturesDir: string,
  fixtures: FixtureNames,
  onSelect: (path: string) => mixed
};

export class FixtureTree extends Component<Props> {
  render() {
    const { fixtures, onSelect } = this.props;
    const rootNode = getPathTree(fixtures);

    return (
      <ul>
        <FixtureTreeNode node={rootNode} parents={[]} onSelect={onSelect} />
      </ul>
    );
  }
}

type FixtureTreeProps = {
  node: TreeNode<string>,
  parents: string[],
  onSelect: (path: string) => mixed
};

class FixtureTreeNode extends Component<FixtureTreeProps> {
  render() {
    const { node, parents, onSelect } = this.props;
    const { values = [], children } = node;
    const childDirs = Object.keys(children);

    // Skip nodes with a single child and no values (eg. __fixtures__ dirs)
    // FIXME: foo/bar/__fixtures__/fixture.js becomes foo/fixture.js (the "bar"
    // is relevant and should be kept)
    if (values.length === 0 && childDirs.length === 1) {
      const [soleDir] = childDirs;

      return (
        <FixtureTreeNode
          node={children[soleDir]}
          parents={parents}
          onSelect={onSelect}
        />
      );
    }

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

  createSelectHandler = (path: string) => e => {
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

function getPathTree(paths: string[]): TreeNode<string> {
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

function getBlankNode() {
  return {
    values: [],
    children: {}
  };
}
