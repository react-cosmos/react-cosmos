// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import styled from 'styled-components';
import { PluginContext } from '../../plugin';
import { getPrimaryRendererState } from '../Renderer/selectors';
import { PropsState } from './PropsState';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { ComponentFixtureState } from 'react-cosmos-shared2/fixtureState';
import type { PluginContextValue } from '../../plugin';
import type { RendererConfig } from '../Renderer';
import type { UrlParams } from '../Router';

type Props = {};

export class ControlPanel extends Component<Props> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  getUrlParams(): UrlParams {
    return this.context.getState('router').urlParams;
  }

  render() {
    const { getConfig, getState } = this.context;
    const rendererState = getState('renderer');
    const { primaryRendererId, renderers } = rendererState;
    const primaryRendererState = getPrimaryRendererState(rendererState);

    if (!primaryRendererState) {
      return null;
    }

    const rendererIds = Object.keys(renderers);
    const { fixtureState } = primaryRendererState;
    const { fixturePath, fullScreen } = this.getUrlParams();

    if (fullScreen || !fixturePath) {
      return null;
    }

    const { webUrl }: RendererConfig = getConfig('renderer');

    return (
      <Container>
        {webUrl && (
          <button
            onClick={() => {
              copyToClipboard(getFullUrl(webUrl));
            }}
          >
            Copy rendererer URL
          </button>
        )}
        {fixtureState && (
          <PropsState
            fixtureState={fixtureState}
            setFixtureState={this.setFixtureState}
          />
        )}
        {rendererIds.length > 1 && (
          <div>
            <p>Renderers ({rendererIds.length})</p>
            <ul>
              {rendererIds.map(rendererId => (
                <li key={rendererId}>
                  <small
                    onClick={this.createRendererSelectHandler(rendererId)}
                    style={{
                      cursor: 'pointer',
                      fontWeight:
                        rendererId === primaryRendererId ? 'bold' : 'normal'
                    }}
                  >
                    {rendererId}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    );
  }

  setFixtureState = (components: ComponentFixtureState[]) => {
    this.context.callMethod('renderer.setFixtureState', fixtureState => ({
      ...fixtureState,
      components
    }));
  };

  createRendererSelectHandler = (rendererId: RendererId) => () => {
    this.context.setState('renderer', prevState => ({
      ...prevState,
      primaryRendererId: rendererId
    }));
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

function getFullUrl(relativeUrl) {
  return `${location.origin}${relativeUrl}`;
}

async function copyToClipboard(text) {
  const { permissions, clipboard } = navigator;

  const { state } = await permissions.query({ name: 'clipboard-write' });
  if (state !== 'granted' && state !== 'prompt') {
    // clipboard permission denied
    return;
  }

  try {
    await clipboard.writeText(text);
    // clipboard successfully set
  } catch (err) {
    // clipboard write failed
  }
}
