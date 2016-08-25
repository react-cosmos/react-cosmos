var React = require('react'),
    loadChild = require('../../src/load-child.js').loadChild;

describe('UNIT Load missing child', function() {
  var component;

  beforeEach(function() {
    component = {
      children: {
        missingChild: function() {
          return {};
        }
      }
    };

    sinon.stub(React, 'createElement', function() {
      throw new Error('Invalid component');
    });

    sinon.stub(console, 'error');
  });

  afterEach(function() {
    React.createElement.restore();

    console.error.restore();
  });

  it('should handle exception', function() {
    expect(function whereAreYouSon() {
      loadChild(component, 'missingChild');
    }).to.not.throw();
  });

  it('should log error', function() {
    loadChild(component, 'missingChild');

    expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
  });
});
