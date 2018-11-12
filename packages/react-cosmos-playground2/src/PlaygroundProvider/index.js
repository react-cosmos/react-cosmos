// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { removeItem } from 'react-cosmos-shared2/util';
import { defaultState, PlaygroundContext } from '../PlaygroundContext';

import type { Node } from 'react';
import type { StateUpdater } from 'react-cosmos-shared2/util';
import type {
  RendererResponse,
  FixtureListMsg,
  FixtureStateMsg
} from 'react-cosmos-shared2/renderer';
import type {
  PlaygroundOptions,
  Methods,
  PlaygroundContextValue
} from '../index.js.flow';

type Props = {
  children: Node,
  options: PlaygroundOptions
};

export class PlaygroundProvider extends Component<
  Props,
  PlaygroundContextValue
> {
  setPluginState = <T>(
    pluginName: string,
    stateChange: StateUpdater<T>,
    cb?: () => mixed
  ) => {
    console.info(`Set plugin "${pluginName}" state`, stateChange);

    // FIXME: Fix state.state confusion (eg. getState(pluginName))
    this.setState(
      ({ state }) => ({
        state: {
          ...state,
          // $FlowFixMe
          [pluginName]: updateState(state[pluginName], stateChange)
        }
      }),
      cb
    );
  };

  pluginMethods = {};

  registerMethods = (methods: Methods) => {
    console.info(`Register methods`, methods);

    const methodNames = Object.keys(methods);

    methodNames.forEach(methodName => {
      this.pluginMethods[methodName] = methods[methodName];
    });

    return () => {
      methodNames.forEach(methodName => {
        delete this.pluginMethods[methodName];
      });
    };
  };

  callMethod = (methodName: string, ...args: any) => {
    console.info(`Call method "${methodName}"`, args);

    if (!this.pluginMethods[methodName]) {
      throw new Error(`Method not found: ${methodName}`);
    }

    this.pluginMethods[methodName](...args);
  };

  eventListeners = {};

  addEventListener = (eventName: string, listener: Function) => {
    console.info(`Add listener for "${eventName}" event`);

    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }

    this.eventListeners[eventName].push(listener);

    return () => {
      this.eventListeners[eventName] = removeItem(
        this.eventListeners[eventName],
        listener
      );

      if (this.eventListeners[eventName].length === 0) {
        delete this.eventListeners[eventName];
      }
    };
  };

  emitEvent = (eventName: string, ...args: any) => {
    console.info(`Event "${eventName}" emitted`, args);

    if (
      !this.eventListeners[eventName] ||
      this.eventListeners[eventName].length === 0
    ) {
      console.warn(`Event "${eventName}" emitted with nobody listening`);
      return;
    }

    this.eventListeners[eventName].forEach(listener => {
      listener(...args);
    });
  };

  state = {
    options: this.props.options,
    state: defaultState,
    setState: this.setPluginState,
    registerMethods: this.registerMethods,
    callMethod: this.callMethod,
    addEventListener: this.addEventListener,
    emitEvent: this.emitEvent
  };

  render() {
    const { children } = this.props;

    return (
      <PlaygroundContext.Provider value={this.state}>
        <Container>{children}</Container>
      </PlaygroundContext.Provider>
    );
  }

  removeRendererResponseListener = () => {};

  componentDidMount() {
    this.removeRendererResponseListener = this.addEventListener(
      'renderer.onResponse',
      this.handleRendererResponse
    );
  }

  componentWillUnmount() {
    this.removeRendererResponseListener();
  }

  handleRendererResponse = (msg: RendererResponse) => {
    switch (msg.type) {
      case 'fixtureList':
        return this.handleFixtureListResponse(msg);
      case 'fixtureState':
        return this.handleFixtureStateResponse(msg);
      default:
      // No need to handle every message. Maybe some plugin cares about it.
    }
  };

  handleFixtureListResponse({ payload }: FixtureListMsg) {
    const {
      core: { renderers }
    } = this.state.state;
    const { rendererId, fixtures } = payload;

    this.setPluginState('core', {
      renderers:
        renderers.indexOf(rendererId) === -1
          ? [...renderers, rendererId]
          : renderers,
      fixtures
    });
  }

  handleFixtureStateResponse({ payload }: FixtureStateMsg) {
    // TODO: Can PlaygroundProvider not depend on any plugin? RendererCore
    this.setPluginState('fixtureState', payload.fixtureState);
  }
}

export function updateState<T>(
  prevState: null | T,
  updater: StateUpdater<T>
): T {
  return typeof updater === 'function' ? updater(prevState) : updater;
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
