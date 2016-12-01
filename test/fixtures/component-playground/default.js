/* eslint-disable react/no-multi-comp, react/prop-types */

const React = require('react');

const PropsProxy = ({
  component,
  fixture,
  onComponentRef,
}) => React.createElement(component, {
  fixture,
  ref: onComponentRef,
});

module.exports = {
  firstProxy: {
    value: PropsProxy,
    next: () => {},
  },
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
  router: {
    routeLink() {},
    goTo() {},
  },
};
