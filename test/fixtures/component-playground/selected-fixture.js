import React from 'react';
import defaultFixture from './default';

module.exports = { ...defaultFixture,
  component: 'FirstComponent',
  fixture: 'default',
  state: {
    // Generating this state from props is tested in mounting tests
    fixtureContents: {
      myProp: false,
      nested: {
        foo: 'bar',
        shouldBeCloned: {},
      },
      state: {
        somethingHappened: false,
      },
    },
    fixtureChange: 10,
  },
};
