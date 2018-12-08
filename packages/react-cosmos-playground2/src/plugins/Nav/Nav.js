// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot } from 'react-plugin';
import { FixtureTree } from './FixtureTree';

import type { RendererItemState } from '../Renderer';
import type { UrlParams } from '../Router';

type Props = {
  projectId: string,
  fixturesDir: string,
  urlParams: UrlParams,
  rendererState: null | RendererItemState,
  setUrlParams: (urlParams: UrlParams) => void,
  storage: {
    getItem: (key: string) => Promise<any>,
    setItem: (key: string, value: any) => Promise<void>
  }
};

export class Nav extends Component<Props> {
  render() {
    const {
      projectId,
      fixturesDir,
      urlParams,
      rendererState,
      storage
    } = this.props;

    if (!rendererState) {
      return null;
    }

    const { fixtures } = rendererState;
    const { fixturePath, fullScreen } = urlParams;

    if (fullScreen) {
      return null;
    }

    return (
      <Container data-testid="nav">
        <Buttons>
          <button disabled={!fixturePath} onClick={this.handleGoHome}>
            home
          </button>
          <Slot name="header-buttons" />
          {fixturePath && (
            <button onClick={this.handleGoFullScreen}>fullscreen</button>
          )}
        </Buttons>
        <FixtureTree
          projectId={projectId}
          fixturesDir={fixturesDir}
          fixtures={fixtures}
          onSelect={this.handleFixtureSelect}
          storage={storage}
        />
      </Container>
    );
  }

  handleGoHome = () => {
    this.props.setUrlParams({});
  };

  handleFixtureSelect = (fixturePath: string) => {
    this.props.setUrlParams({ fixturePath });
  };

  handleGoFullScreen = () => {
    const {
      urlParams: { fixturePath },
      setUrlParams
    } = this.props;

    setUrlParams({ fixturePath, fullScreen: true });
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;
