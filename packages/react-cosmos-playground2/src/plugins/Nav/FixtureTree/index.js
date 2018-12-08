// @flow

import React, { Component } from 'react';
import { getPathTree, collapsePathTreeDirs } from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';
import type { TreeExpansion } from './shared';

type Props = {
  projectId: string,
  fixturesDir: string,
  fixtures: FixtureNames,
  onSelect: (path: string) => mixed,
  storage: {
    getItem: (key: string) => Promise<any>,
    setItem: (key: string, value: any) => Promise<void>
  }
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
    const { storage } = this.props;
    const treeExpansion = (await storage.getItem(this.getStorageKey())) || {};

    this.setState({ treeExpansion });
  }

  persistTreeExpansion() {
    const { storage } = this.props;
    const { treeExpansion } = this.state;

    storage.setItem(this.getStorageKey(), treeExpansion);
  }

  getStorageKey() {
    return `cosmos-treeExpansion-${this.props.projectId}`;
  }
}
