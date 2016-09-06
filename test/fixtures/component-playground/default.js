/* eslint-disable react/no-multi-comp */

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

module.exports = {
  components: {
    FirstComponent: {
      class: FirstComponent,
      fixtures: {
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
    },
    SecondComponent: {
      class: SecondComponent,
      fixtures: {
        index: {
          myProp: true,
          state: {
            somethingHappened: true,
          },
        },
      },
    },
  },
  router: {
    routeLink() {},
    goTo() {},
  },
};
