import styled from 'styled-components';
import * as React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { StorageSpec } from '../../Storage/public';
import { TreeExpansion } from './shared';
import {
  getPathTree,
  collapsePathTreeDirs,
  hideFixtureSuffix,
  collapseSoloIndexes
} from './pathTree';
import { FixtureTreeNode } from './FixtureTreeNode';

type Props = {
  projectId: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureNamesByPath;
  selectedFixtureId: null | FixtureId;
  onSelect: (path: FixtureId) => unknown;
  storage: StorageSpec['methods'];
};

type State = {
  treeExpansion: TreeExpansion;
};

export class FixtureTree extends React.Component<Props, State> {
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
    const {
      fixturesDir,
      fixtureFileSuffix,
      fixtures,
      selectedFixtureId,
      onSelect
    } = this.props;
    const { treeExpansion } = this.state;

    const rootNode = getTreeFromFixtures(
      fixtures,
      fixturesDir,
      fixtureFileSuffix
    );

    return (
      <Container>
        <FixtureTreeNode
          node={rootNode}
          parents={[]}
          treeExpansion={treeExpansion}
          selectedFixtureId={selectedFixtureId}
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

function getTreeFromFixtures(
  fixtures: FixtureNamesByPath,
  fixturesDir: string,
  fixtureFileSuffix: string
) {
  let rootNode = getPathTree(fixtures);
  rootNode = collapsePathTreeDirs(rootNode, fixturesDir);
  rootNode = hideFixtureSuffix(rootNode, fixtureFileSuffix);
  rootNode = collapseSoloIndexes(rootNode);

  return rootNode;
}

// Reason for inline-block: https://stackoverflow.com/a/53895622/128816
const Container = styled.div`
  display: inline-block;
  min-width: 100%;
`;
