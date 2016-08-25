var React = require('react'),
    ReactDOM = require('react-dom-polyfill')(React),
    render = require('../../src/render.js').render;

describe('INTEGRATION Render and inject state', function() {
  var domContainer,
      component;

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

  beforeEach(function() {
    domContainer = document.createElement('div');
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should set state on root component', function() {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {foo: 'bar'}
      },
      container: domContainer
    });

    expect(component.state.foo).to.equal('bar');
  });

  it('should set state on child component', function() {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: {foo: 'bar'}
          }
        }
      },
      container: domContainer
    });

    expect(component.refs.child.state.foo).to.equal('bar');
  });

  it('should set state on grandchild component', function() {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: {
              children: {
                child: {foo: 'bar'}
              }
            }
          }
        }
      },
      container: domContainer
    });

    expect(component.refs.child.refs.child.state.foo).to.equal('bar');
  });
});
