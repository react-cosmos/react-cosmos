// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot } from 'react-plugin';
import { PluginContext } from '../../plugin';
import { getUrlParams } from '../Router/selectors';
import { getPrimaryRendererState } from '../Renderer/selectors';
import { FixtureTree } from './FixtureTree';

import type { CoreConfig } from '../../index.js.flow';
import type { PluginContextValue } from '../../plugin';

export class Nav extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    const { getConfig, getState } = this.context;
    const primaryRendererState = getPrimaryRendererState(getState('renderer'));

    if (!primaryRendererState) {
      return null;
    }

    const { fixtures } = primaryRendererState;
    const { fixturePath, fullScreen } = getUrlParams(this.context);

    if (fullScreen) {
      return null;
    }

    const { projectId, fixturesDir }: CoreConfig = getConfig('core');

    return (
      <Container data-testid="nav">
        {fixturePath && (
          <Buttons>
            <button onClick={this.handleGoHome}>home</button>
            <Slot name="header-buttons" />
            <button onClick={this.handleGoFullScreen}>fullscreen</button>
          </Buttons>
        )}
        <FixtureTree
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
    const { fixturePath } = getUrlParams(this.context);

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
