/* eslint-disable react/no-multi-comp, react/prop-types */

const React = require('react');

class FirstComponent extends React.Component {
  render() {
    return React.DOM.div();
  }
}

class SecondComponent extends React.Component {
  render() {
    return React.DOM.div();
  }
}

const PropsProxy = ({
  fixture,
  onPreviewRef,
}) => React.createElement(fixture.component, {
  fixture,
  ref: onPreviewRef,
});

module.exports = {
  firstProxy: {
    value: PropsProxy,
    next: () => {},
  },
  components: {
    FirstComponent,
    SecondComponent,
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
