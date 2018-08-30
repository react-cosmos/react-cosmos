// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot } from 'react-plugin';
import { PlaygroundContext } from '../context';

import type { PlaygroundOptions, PlaygroundContextValue } from '../../types';

type Props = {
  options: PlaygroundOptions
};

export class Root extends Component<Props, PlaygroundContextValue> {
  setFixtureState = () => {};

  state = {
    options: this.props.options,
    fixtureState: null,
    setFixtureState: this.setFixtureState
  };

  render() {
    const { fixtureState } = this.state;

    return (
      <PlaygroundContext.Provider value={this.state}>
        <Container>
          {!fixtureState && 'Waiting for renderer...'}
          <Slot name="root">
            <Slot name="preview" />
          </Slot>
        </Container>
      </PlaygroundContext.Provider>
    );
  }
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: sans-serif;
  font-size: 16px;
  display: flex;
`;
