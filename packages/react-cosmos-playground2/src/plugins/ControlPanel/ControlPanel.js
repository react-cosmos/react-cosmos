// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import styled from 'styled-components';
import { PluginsConsumer } from 'react-plugin';
import { PropsState } from './PropsState';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type { ComponentFixtureState } from 'react-cosmos-shared2/fixtureState';
import type { UrlParams } from '../Router';
import type { RendererState, RendererItemState } from '../Renderer';

type Props = {
  webUrl: null | string,
  urlParams: UrlParams,
  rendererState: RendererState,
  primaryRendererState: null | RendererItemState,
  setComponentsFixtureState: (components: ComponentFixtureState[]) => void,
  selectPrimaryRenderer: (rendererId: RendererId) => void
};

export class ControlPanel extends Component<Props> {
  render() {
    const {
      webUrl,
      urlParams,
      rendererState,
      primaryRendererState
    } = this.props;
    const { primaryRendererId, renderers } = rendererState;

    if (!primaryRendererState) {
      return null;
    }

    const rendererIds = Object.keys(renderers);
    const { fixtureState } = primaryRendererState;
    const { fixturePath, fullScreen } = urlParams;

    if (fullScreen || !fixturePath) {
      return null;
    }

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
            setFixtureState={this.setComponentsFixtureState}
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
        <div>
          <p>Plugins</p>
          <ul>
            <PluginsConsumer>
              {({ plugins, enable, isShadowed }) =>
                plugins.map(({ id, name, enabled }) => (
                  <li key={id} style={{ opacity: isShadowed(id) ? 0.5 : 1 }}>
                    <label
                      onMouseDown={() => {
                        enable(id, !enabled);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={enabled}
                        readOnly
                        disabled={isShadowed(id)}
                      />{' '}
                      {name}
                    </label>
                  </li>
                ))
              }
            </PluginsConsumer>
          </ul>
        </div>
      </Container>
    );
  }

  setComponentsFixtureState = (components: ComponentFixtureState[]) => {
    this.props.setComponentsFixtureState(components);
  };

  createRendererSelectHandler = (rendererId: RendererId) => () => {
    this.props.selectPrimaryRenderer(rendererId);
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  background: var(--grey1);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
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
