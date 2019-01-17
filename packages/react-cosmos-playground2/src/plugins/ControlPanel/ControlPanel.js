// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import styled from 'styled-components';
import { PluginsConsumer } from 'react-plugin';
import { PropsState } from './PropsState';

import type { RendererId } from 'react-cosmos-shared2/renderer';
import type {
  FixtureState,
  ComponentFixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { UrlParams } from '../Router';

type Props = {
  webUrl: null | string,
  urlParams: UrlParams,
  connectedRendererIds: RendererId[],
  primaryRendererId: null | RendererId,
  fixtureState: null | FixtureState,
  setComponentsFixtureState: (components: ComponentFixtureState[]) => void,
  selectPrimaryRenderer: (rendererId: RendererId) => void
};

export class ControlPanel extends Component<Props> {
  render() {
    const {
      webUrl,
      urlParams,
      connectedRendererIds,
      primaryRendererId,
      fixtureState
    } = this.props;
    const { fixturePath, fullScreen } = urlParams;

    if (!primaryRendererId || fullScreen || !fixturePath) {
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
        {connectedRendererIds.length > 1 && (
          <div>
            <p>Renderers ({connectedRendererIds.length})</p>
            <ul>
              {connectedRendererIds.map(rendererId => (
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
              {({ plugins, enable }) =>
                plugins.map(({ name, enabled }) => (
                  <li key={name}>
                    <label
                      onMouseDown={() => {
                        enable(name, !enabled);
                      }}
                    >
                      <input type="checkbox" checked={enabled} readOnly />{' '}
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
