var ComponentTree = require('../../packages/react-component-tree');

module.exports = function() {
  beforeEach(function() {
    sinon.spy(ComponentTree.loadChild, 'loadChild');
  });

  afterEach(function() {
    ComponentTree.loadChild.loadChild.restore();
  });
};
