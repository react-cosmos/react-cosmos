// @flow

import React, { Component } from 'react';
import { getPathTree, collapsePathTreeDirs } from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';
import type { TreeExpansion } from './shared';

type Props = {
  fixturesDir: string,
  fixtures: FixtureNames,
  onSelect: (path: string) => mixed
};

type State = {
  treeExpansion: TreeExpansion
};

export class FixtureTree extends Component<Props, State> {
  state = {
    // TODO: Persist in local storage
    treeExpansion: {}
  };

  render() {
    const { fixtures, fixturesDir, onSelect } = this.props;
    const { treeExpansion } = this.state;
    const rootNode = collapsePathTreeDirs(getPathTree(fixtures), fixturesDir);

    return (
      <ul>
        <FixtureTreeNode
          node={rootNode}
          parents={[]}
          treeExpansion={treeExpansion}
          onSelect={onSelect}
          onToggleExpansion={this.handleToggleExpansion}
        />
      </ul>
    );
  }

  handleToggleExpansion = (nodePath: string, expanded: boolean) => {
    this.setState(({ treeExpansion }) => ({
      treeExpansion: { ...treeExpansion, [nodePath]: expanded }
    }));
  };
}
