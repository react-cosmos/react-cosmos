import React, { Component } from 'react';
import { CosmosNativeLoader } from 'react-cosmos-loader/native';
/* eslint-disable-next-line import/no-unresolved, import/extensions */
import { options, getUserModules } from './cosmos.modules';

export default class App extends Component {
  render() {
    return <CosmosNativeLoader options={options} modules={getUserModules()} />;
  }
}
