// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { FixtureTree } from './FixtureTree';

import type { UrlParams } from '../Router';
import type { Storage } from '../Storage';

type Props = {
  projectId: string,
  fixturesDir: string,
  fixtureFileSuffix: string,
  urlParams: UrlParams,
  rendererConnected: boolean,
  fixtures: string[],
  setUrlParams: (urlParams: UrlParams) => void,
  storage: Storage
};

export class Nav extends Component<Props> {
  render() {
    const {
      projectId,
      fixturesDir,
      fixtureFileSuffix,
      urlParams,
      rendererConnected,
      fixtures,
      storage
    } = this.props;
    const { fixturePath, fullScreen } = urlParams;

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
          selectedFixturePath={fixturePath || null}
          onSelect={this.handleFixtureSelect}
          storage={storage}
        />
      </Container>
    );
  }

  handleFixtureSelect = (fixturePath: string) => {
    this.props.setUrlParams({ fixturePath });
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  background: var(--grey1);
  border-right: 1px solid var(--darkest);
  overflow: auto;
`;
