// @flow

import React from 'react';

// We test for edge cases to make sure we degrade gracefully
const InlineComponent = () => <span />;

export default {
  component: InlineComponent,
  props: {}
};
