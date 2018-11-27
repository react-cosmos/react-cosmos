// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import localForage from 'localforage';
import { PluginContext } from '../../plugin';
import { getPrimaryRendererState } from '../Renderer/selectors';
import { FixtureTree } from './FixtureTree';

import type { CoreConfig } from '../../index.js.flow';
import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from '../Router';

export class Nav extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  getUrlParams(): UrlParams {
    return this.context.getState('router').urlParams;
  }

  render() {
    const { getConfig, getState } = this.context;
    const primaryRendererState = getPrimaryRendererState(getState('renderer'));

    if (!primaryRendererState) {
      return null;
    }

    const { fixtures } = primaryRendererState;
    const { fixturePath, fullScreen } = this.getUrlParams();

    if (fullScreen) {
      return null;
    }

    const { projectId, fixturesDir }: CoreConfig = getConfig('core');

    return (
      <Container data-testid="nav">
        {fixturePath && (
          <Buttons>
            <button onClick={this.handleGoHome}>home</button>
            <button onClick={this.handleGoFullScreen}>fullscreen</button>
          </Buttons>
        )}
        <FixtureTree
          storageApi={localForage}
          projectId={projectId}
          fixturesDir={fixturesDir}
          fixtures={fixtures}
          onSelect={this.handleFixtureSelect}
        />
      </Container>
    );
  }

  handleGoHome = () => {
    this.context.callMethod('router.setUrlParams', {});
  };

  handleFixtureSelect = (fixturePath: string) => {
    this.context.callMethod('router.setUrlParams', { fixturePath });
  };

  handleGoFullScreen = () => {
    const { callMethod } = this.context;
    const { fixturePath } = this.getUrlParams();

    callMethod('router.setUrlParams', {
      fixturePath,
      fullScreen: true
    });
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
