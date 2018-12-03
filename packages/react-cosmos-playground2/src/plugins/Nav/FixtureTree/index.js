// @flow

import React, { Component } from 'react';
import { getPathTree, collapsePathTreeDirs } from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';
import { PluginContext } from '../../../plugin';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';
import type { PluginContextValue } from '../../../plugin';
import type { TreeExpansion } from './shared';

type Props = {
  projectId: string,
  fixturesDir: string,
  fixtures: FixtureNames,
  onSelect: (path: string) => mixed
};

type State = {
  treeExpansion: TreeExpansion
};

export class FixtureTree extends Component<Props, State> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

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
    const { callMethod } = this.context;

    const treeExpansion =
      (await callMethod('storage.getItem', this.getStorageKey())) || {};

    this.setState({ treeExpansion });
  }

  persistTreeExpansion() {
    const { callMethod } = this.context;
    const { treeExpansion } = this.state;

    callMethod('storage.setItem', this.getStorageKey(), treeExpansion);
  }

  getStorageKey() {
    return `cosmos-treeExpansion-${this.props.projectId}`;
  }
}
