// @flow

import { isElement } from 'react-is';
import React, { Component } from 'react';
import { CaptureProps } from './CaptureProps';
import { FixtureContext, EMPTY_FIXTURE_DATA } from './FixtureContext';

import type { Node, Element } from 'react';
import type { FixtureData, UpdateFixtureData } from './types';

type Props = {
  children: Node
};

type State = {
  fixtureData: FixtureData,
  updateFixtureData: UpdateFixtureData
};

// TODO: Listen to remote fixture data update (eg. how to override props?)
export class Fixture extends Component<Props, State> {
  updateFixtureData = (key: string, value: mixed) => {
    const { fixtureData } = this.state;

    // TODO: Publish fixture data remotely
    console.log('Fixture data update', { key, value });

    this.setState({
      fixtureData: {
        ...fixtureData,
        [key]: value
      }
    });
  };

  state = {
    fixtureData: EMPTY_FIXTURE_DATA,
    updateFixtureData: this.updateFixtureData
  };

  render() {
    const { children } = this.props;

    if (!isElement(children)) {
      return children;
    }

    // $FlowFixMe Flow can't get cues from react-is package
    const element: Element<any> = children;

    return (
      <FixtureContext.Provider value={this.state}>
        <CaptureProps>{element}</CaptureProps>
      </FixtureContext.Provider>
    );
  }
}
