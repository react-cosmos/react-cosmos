import React, { Component } from 'react';
import { Text } from 'react-native';
import { Page } from './Page';

export default class App extends Component {
  render() {
    return (
      <Page>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </Page>
    );
  }
}
