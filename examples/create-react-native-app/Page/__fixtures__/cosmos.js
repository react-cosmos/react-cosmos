import React, { Fragment } from 'react';
import { Text } from 'react-native';
import { Page } from '..';

export default {
  component: Page,
  props: {
    children: (
      <Fragment>
        <Text>React Native Cosmos</Text>
        <Text>SWEET!</Text>
      </Fragment>
    )
  }
};
