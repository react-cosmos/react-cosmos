import React, { Fragment } from 'react';
import { Text } from 'react-native';
import { Page } from '..';

export default {
  component: Page,
  props: {
    children: (
      <Fragment>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </Fragment>
    )
  }
};
