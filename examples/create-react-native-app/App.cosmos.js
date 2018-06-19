import React, { Component } from 'react';
import { CosmosNativeLoader } from 'react-cosmos-loader/native';
import { getUserModules } from './cosmos.modules';

export default class App extends Component {
  render() {
    return (
      <CosmosNativeLoader options={{ port: 8989 }} modules={getUserModules()} />
    );
  }
}
