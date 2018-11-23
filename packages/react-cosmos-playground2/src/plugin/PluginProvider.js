// @flow

import React, { Component } from 'react';
import { get } from 'lodash';
import { removeItem, updateState } from 'react-cosmos-shared2/util';
import { PluginContext } from './PluginContext';
import { getPluginConfig } from './config';
import { getInitialPluginState } from './state';

import type { Node } from 'react';
import type { StateUpdater } from 'react-cosmos-shared2/util';
import type { Methods, PluginContextValue } from './shared';

type Props = {
  children: Node,
  config: Object
};

export class PluginProvider extends Component<Props, PluginContextValue> {
  static defaultProps = {
    config: {}
  };

  getPluginConfig = (configPath: string) => {
    return get(this.state.pluginConfig, configPath);
  };

  getPluginState = (stateKey: string) => {
    return this.state.pluginState[stateKey];
  };

  setPluginState = <T>(
    pluginName: string,
    stateChange: StateUpdater<T>,
    cb?: () => mixed
  ) => {
    console.info(
      `Set plugin "${pluginName}" state`,
      typeof stateChange === 'function' ? '(updater fn)' : stateChange
    );

    this.setState(
      ({ pluginState }) => ({
        pluginState: {
          ...pluginState,
          [pluginName]: updateState(pluginState[pluginName], stateChange)
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
    pluginConfig: getPluginConfig(this.props.config),
    getConfig: this.getPluginConfig,
    pluginState: getInitialPluginState(),
    getState: this.getPluginState,
    setState: this.setPluginState,
    registerMethods: this.registerMethods,
    callMethod: this.callMethod,
    addEventListener: this.addEventListener,
    emitEvent: this.emitEvent
  };

  render() {
    const { children } = this.props;

    return (
      <PluginContext.Provider value={this.state}>
        {children}
      </PluginContext.Provider>
    );
  }
}
