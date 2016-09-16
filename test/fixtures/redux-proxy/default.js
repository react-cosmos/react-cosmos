/* eslint-disable react/prefer-stateless-function */
// Stick to ES6 class syntax instead of stateless functions as it supports refs

const React = require('react');

class DivComponent extends React.Component {
  render() {
    return React.createElement('div');
  }
}

DivComponent.contextTypes = {
  store: React.PropTypes.object,
};

module.exports = {
  children: React.createElement(DivComponent, { ref: 'divcomponent' }),
  reduxStore: { foo: 'bar' },
};
