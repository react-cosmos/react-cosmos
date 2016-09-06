/* eslint-env mocha */
/* global sinon */

const ComponentTree = require('../../packages/react-component-tree');

module.exports = () => {
  beforeEach(() => {
    sinon.spy(ComponentTree.loadChild, 'loadChild');
  });

  afterEach(() => {
    ComponentTree.loadChild.loadChild.restore();
  });
};
