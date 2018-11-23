// @flow

import React, { Component } from 'react';
import { getPathTree, collapsePathTreeDirs } from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';

type Props = {
  fixturesDir: string,
  fixtures: FixtureNames,
  onSelect: (path: string) => mixed
};

export class FixtureTree extends Component<Props> {
  render() {
    const { fixtures, fixturesDir, onSelect } = this.props;
    const rootNode = collapsePathTreeDirs(getPathTree(fixtures), fixturesDir);

    return (
      <ul>
        <FixtureTreeNode node={rootNode} parents={[]} onSelect={onSelect} />
      </ul>
    );
  }
}
