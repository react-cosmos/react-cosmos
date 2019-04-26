import styled from 'styled-components';
import * as React from 'react';
import { FixtureNamesByPath, FixtureId } from 'react-cosmos-shared2/renderer';
import { StorageSpec } from '../Storage/public';
import { FixtureTree } from './FixtureTree';

type Props = {
  projectId: string;
  fixturesDir: string;
  fixtureFileSuffix: string;
  selectedFixtureId: null | FixtureId;
  fullScreen: boolean;
  rendererConnected: boolean;
  fixtures: FixtureNamesByPath;
  selectFixture: (fixtureId: FixtureId, fullScreen: boolean) => void;
  createFixtureUrl: (fixtureId: FixtureId) => string;
  storage: StorageSpec['methods'];
};

export class Nav extends React.Component<Props> {
  render() {
    const {
      projectId,
      fixturesDir,
      fixtureFileSuffix,
      selectedFixtureId,
      fullScreen,
      rendererConnected,
      fixtures,
      selectFixture,
      createFixtureUrl,
      storage
    } = this.props;

    if (fullScreen) {
      return null;
    }

    if (!rendererConnected) {
      return <Container />;
    }

    return (
      <Container data-testid="nav">
        <FixtureTree
          projectId={projectId}
          fixturesDir={fixturesDir}
          fixtureFileSuffix={fixtureFileSuffix}
          fixtures={fixtures}
          selectedFixtureId={selectedFixtureId}
          createFixtureUrl={createFixtureUrl}
          onSelect={fixtureId => selectFixture(fixtureId, false)}
          storage={storage}
        />
      </Container>
    );
  }
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  background: var(--grey1);
  border-right: 1px solid var(--darkest);
  overflow: auto;
`;
