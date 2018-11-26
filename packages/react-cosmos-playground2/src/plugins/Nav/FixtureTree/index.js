// @flow

import React, { Component } from 'react';
import { getPathTree, collapsePathTreeDirs } from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';
import type { TreeExpansion } from './shared';

type Props = {
  storageApi: {
    +getItem: string => any,
    +setItem: (string, any) => any
  },
  projectId: string,
  fixturesDir: string,
  fixtures: FixtureNames,
  onSelect: (path: string) => mixed
};

type State = {
  treeExpansion: TreeExpansion
};

export class FixtureTree extends Component<Props, State> {
  state = {
    treeExpansion: {}
  };

  componentDidMount() {
    this.restoreTreeExpansion();
  }

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
    this.setState(
      ({ treeExpansion }) => ({
        treeExpansion: { ...treeExpansion, [nodePath]: expanded }
      }),
      this.persistTreeExpansion
    );
  };

  async restoreTreeExpansion() {
    const { storageApi } = this.props;
    const treeExpansion =
      (await storageApi.getItem(this.getStorageKey())) || {};

    this.setState({ treeExpansion });
  }

  persistTreeExpansion() {
    const { storageApi } = this.props;
    const { treeExpansion } = this.state;

    storageApi.setItem(this.getStorageKey(), treeExpansion);
  }

  getStorageKey() {
    return `cosmos-treeExpansion-${this.props.projectId}`;
  }
}
