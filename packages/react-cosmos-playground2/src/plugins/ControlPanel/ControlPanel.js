// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import styled from 'styled-components';
import { PluginContext } from '../../plugin';
import { getPrimaryRendererState } from '../RendererMessageHandler/selectors';
import { PropsState } from './PropsState';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { ComponentFixtureState } from 'react-cosmos-shared2/fixtureState';
import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from '../Router';

type Props = {};

export class ControlPanel extends Component<Props> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    const { getConfig, getState } = this.context;
    const renderersState = getState('renderers');
    const { primaryRendererId, renderers } = renderersState;
    const primaryRendererState = getPrimaryRendererState(renderersState);

    if (!primaryRendererState) {
      return null;
    }

    const rendererIds = Object.keys(renderers);
    const { fixtureState } = primaryRendererState;
    const { fixturePath, fullScreen }: UrlParams = getState('urlParams');

    if (fullScreen || !fixturePath || !fixtureState) {
      return null;
    }

    const webRendererUrl = getConfig('renderer.webUrl');

    return (
      <Container>
        {webRendererUrl && (
          <button
            onClick={() => {
              copyToClipboard(getFullUrl(webRendererUrl));
            }}
          >
            Copy rendererer URL
          </button>
        )}
        <PropsState
          fixtureState={fixtureState}
          setFixtureState={this.setFixtureState}
        />
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
    this.context.setState('renderers', prevState => ({
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
