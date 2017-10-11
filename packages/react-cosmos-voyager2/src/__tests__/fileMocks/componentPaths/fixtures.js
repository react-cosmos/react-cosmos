// @flow

import React from 'react';
import Italics from './Italics';
import Bold from './Bold';

const InlineComponent = () => <span />;

export default [
  {
    component: Bold,
    props: {
      name: 'Sarah'
    }
  },
  {
    component: InlineComponent,
    props: {
      name: 'Alina'
    }
  },
  {
    component: Italics,
    props: {
      name: 'John'
    }
  }
];
