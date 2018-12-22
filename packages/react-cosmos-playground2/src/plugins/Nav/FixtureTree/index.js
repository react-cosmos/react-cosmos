// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { getPathTree, collapsePathTreeDirs } from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';

import type { FixtureNames } from 'react-cosmos-shared2/renderer';
import type { Storage } from '../../Storage';
import type { TreeExpansion } from './shared';

type Props = {
  projectId: string,
  fixturesDir: string,
  fixtures: FixtureNames,
  selectedFixturePath: null | string,
  onSelect: (path: string) => mixed,
  storage: Storage
};

type State = {
  treeExpansion: TreeExpansion
};

export class FixtureTree extends Component<Props, State> {
  state = {
    treeExpansion: {}
  };

  unmounted = false;

  componentDidMount() {
    this.restoreTreeExpansion();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { fixturesDir, fixtures, selectedFixturePath, onSelect } = this.props;
    const { treeExpansion } = this.state;
    const rootNode = collapsePathTreeDirs(getPathTree(fixtures), fixturesDir);

    return (
      <Container>
        <FixtureTreeNode
          node={rootNode}
          parents={[]}
          treeExpansion={treeExpansion}
          selectedFixturePath={selectedFixturePath}
          onSelect={onSelect}
          onToggleExpansion={this.handleToggleExpansion}
        />
      </Container>
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

    if (!this.unmounted) {
      this.setState({ treeExpansion });
    }
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

// Reason for inline-block: https://stackoverflow.com/a/53895622/128816
const Container = styled.div`
  display: inline-block;
  min-width: 100%;
`;
