const React = require('react');

module.exports = {
  fixtures: {
    FirstComponent: {
      default: {
        myProp: false,
        nested: {
          foo: 'bar',
          shouldBeCloned: {},
        },
        children: [
          React.createElement('span', {
            key: '1',
            children: 'test child',
            customProp() {},
          }),
        ],
        state: {
          somethingHappened: false,
        },
      },
      error: {},
    },
    SecondComponent: {
      index: {
        myProp: true,
        state: {
          somethingHappened: true,
        },
      },
    },
  },
  loaderUri: '/loader/',
  router: {
    routeLink() {},
    goTo() {},
  },
};
