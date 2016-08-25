var React = require('react'),
    TestUtils = require('react-addons-test-utils'),
    renderIntoDocument = TestUtils.renderIntoDocument,
    serialize = require('../../src/serialize.js').serialize;

describe('UNIT Serialize', function() {
  class ChildComponent extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  class ParentComponent extends React.Component {
    render() {
      return React.createElement(ChildComponent, {ref: 'child'});
    }
  }

  class GrandparentComponent extends React.Component {
    render() {
      return React.createElement(ParentComponent, {ref: 'child'});
    }
  }

  var render = function(Component, props) {
    return renderIntoDocument(React.createElement(Component, props));
  }

  it('should extract component props', function() {
    var component = render(ChildComponent, {foo: 'bar'});

    expect(serialize(component).foo).to.equal('bar');
  });

  it('should extract component state', function() {
    var component = render(ChildComponent);
    component.setState({foo: 'bar'});

    expect(serialize(component).state.foo).to.equal('bar');
  });

  it('should not add .state key on empty state', function() {
    var component = render(ChildComponent, {foo: 'bar'});

    expect(serialize(component).state).to.be.undefined;
  });

  it('should extract child component state', function() {
    var component = render(ParentComponent);
    component.refs.child.setState({foo: 'bar'});

    expect(serialize(component).state.children.child.foo).to.equal('bar');
  });

  it('should not add .children key on children with empty state', function() {
    var component = render(ParentComponent);
    component.setState({foo: 'bar'});

    expect(serialize(component).state.children).to.be.undefined;
  });

  it('should extract child state recursively', function() {
    var component = render(GrandparentComponent);
    component.refs.child.refs.child.setState({foo: 'bar'});

    expect(serialize(component).state.children.child.children.child.foo)
          .to.equal('bar');
  });
});
