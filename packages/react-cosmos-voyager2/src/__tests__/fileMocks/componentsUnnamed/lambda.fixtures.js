// @flow

import React from 'react';

// There's no way to detect a name for these inline components, we they will be
// named "Component", "Component (1)", etc.

export default [
  {
    name: 'lamba fixture 1',
    component: () => <span>yo</span>,
    props: {}
  },
  {
    name: 'lamba fixture 2',
    component: () => <span>yo yo</span>,
    props: {}
  }
];
