// @flow

import { Component } from 'react';
import localForage from 'localforage';
import { PluginContext } from '../../plugin';

import type { PluginContextValue } from '../../plugin';

export class Storage extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    return null;
  }

  unregisterMethods = () => {};

  componentDidMount() {
    console.log(localForage);

    this.unregisterMethods = this.context.registerMethods({
      'storage.getItem': this.handleGetItem,
      'storage.setItem': this.handleSetItem
    });
  }

  componentWillUnmount() {
    this.unregisterMethods();
  }

  handleGetItem = (key: string) => {
    return localForage.getItem(key);
  };

  handleSetItem = (key: string, value: any) => {
    return localForage.setItem(key, value);
  };
}
