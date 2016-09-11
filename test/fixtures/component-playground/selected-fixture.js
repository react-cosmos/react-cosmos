import React from 'react';
import _ from 'lodash';
import defaultFixture from './default.js';

module.exports = _.merge({}, defaultFixture, {
  component: 'FirstComponent',
  fixture: 'default',
  containerClassName: 'my-app-namespace',
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
    fixtureUnserializableProps: {
      children: [
        React.createElement('span', {
          key: '1',
          children: 'test child',
          customProp() {},
        }),
      ],
    },
    fixtureChange: 10,
  },
});
