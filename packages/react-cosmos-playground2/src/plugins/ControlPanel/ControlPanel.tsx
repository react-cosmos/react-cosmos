import * as React from 'react';
import {
  ComponentFixtureState,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import { RendererId, FixtureId } from 'react-cosmos-shared2/renderer';
import { PluginsConsumer } from 'react-plugin';
import styled from 'styled-components';
import { PropsState } from './PropsState';

type Props = {
  selectedFixtureId: null | FixtureId;
  fullScreen: boolean;
  connectedRendererIds: RendererId[];
  primaryRendererId: null | RendererId;
  fixtureState: FixtureState;
  setComponentsFixtureState: (components: ComponentFixtureState[]) => void;
  selectPrimaryRenderer: (rendererId: RendererId) => void;
};

export class ControlPanel extends React.Component<Props> {
  render() {
    const {
      selectedFixtureId,
      fullScreen,
      connectedRendererIds,
      primaryRendererId,
      fixtureState
    } = this.props;

    if (!primaryRendererId || fullScreen || !selectedFixtureId) {
      return null;
    }

    return (
      <Container>
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
