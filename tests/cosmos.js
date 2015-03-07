var React = require('react/addons'),
    Cosmos = require('../cosmos.js'),
    router = require('../lib/router');

describe('Cosmos', function() {
  describe('component lookup', function() {
    beforeEach(function() {
      Cosmos.components.CoreComponent = {};
    });

    afterEach(function() {
      delete Cosmos.components.CoreComponent;
    });

    it('should draw components from the .components namespace', function() {
      expect(Cosmos.getComponentByName('CoreComponent'))
            .to.equal(Cosmos.components.CoreComponent);
    });

    it('should call component lookup callback with name', function() {
      var wantedComponentName,
          componentLookup = function(name) {
            wantedComponentName = name;
          };

      Cosmos.getComponentByName('MyComponent', componentLookup);

      expect(wantedComponentName).to.equal('MyComponent');
    });

    it('should draw components from lookup callback', function() {
      var MyComponent = {},
          componentLookup = function(name) {
            return MyComponent;
          };

      expect(Cosmos.getComponentByName('MyComponent', componentLookup))
            .to.equal(MyComponent);
    });

    it('should fall back to Cosmos namespace after componentLookup',
       function() {
      var componentLookup = function(name) {
        // Return nothing, let Cosmos fall back
        return;
      };

      expect(Cosmos.getComponentByName('CoreComponent', componentLookup))
            .to.equal(Cosmos.components.CoreComponent);
    });
  });

  describe('.createElement', function() {
    var MyComponent = function() {};

    beforeEach(function() {
      sinon.stub(React, 'createElement');

      sinon.stub(Cosmos, 'getComponentByName', function() {
        return MyComponent;
      });
    });

    afterEach(function() {
      React.createElement.restore();

      Cosmos.getComponentByName.restore();
    });

    it('should create React element for component class', function() {
      Cosmos.createElement({
        component: 'MyComponent'
      });

      expect(React.createElement.lastCall.args[0]).to.equal(MyComponent);
    });

    it('should create component element with props', function() {
      var props = {
        component: 'MyComponent'
      };
      Cosmos.createElement(props);

      expect(React.createElement.lastCall.args[1]).to.equal(props);
    });

    it('should not instantiate component that is a number', function() {
      MyComponent = 5;

      expect(function() {
        Cosmos.createElement({component: 'MyComponent'});
      }).to.throw();
    });

    it('should not instantiate component that is a string', function() {
      MyComponent = 'string';

      expect(function() {
        Cosmos.createElement({component: 'MyComponent'});
      }).to.throw();
    });

    it('should not instantiate component that is an array', function() {
      MyComponent = [1, 2, 3];

      expect(function() {
        Cosmos.createElement({component: 'MyComponent'});
      }).to.throw();
    });

    it('should not instantiate component that is an object', function() {
      MyComponent = {x: true};

      expect(function() {
        Cosmos.createElement({component: 'MyComponent'});
      }).to.throw();
    });
  })

  describe('.render', function() {
    beforeEach(function() {
      sinon.stub(Cosmos, 'createElement');

      sinon.stub(React, 'render');
      sinon.stub(React, 'renderToString');
    });

    afterEach(function() {
      Cosmos.createElement.restore();

      React.render.restore();
      React.renderToString.restore();
    });

    it('should render to DOM if received a container', function() {
      Cosmos.render({component: 'MyComponent'}, '<div>');

      expect(React.render.callCount).to.equal(1);
    });

    it('should pass DOM container to React.render', function() {
      var container = document.createElement('div');
      Cosmos.render({component: 'MyComponent'}, container);

      expect(React.render.lastCall.args[1]).to.equal(container);
    });

    it('should render to string if did not receive a container', function() {
      Cosmos.render({component: 'MyComponent'});

      expect(React.renderToString.callCount).to.equal(1);
    });

    it('should create element with the same props', function() {
      var props = {
        component: 'MyComponent',
        foo: 'bar'
      };
      Cosmos.render(props);

      expect(Cosmos.createElement.lastCall.args[0]).to.equal(props);
    });
  });

  describe('.start', function() {

    var routerInstance = {};

    beforeEach(function() {
      sinon.stub(Cosmos, 'render');

      sinon.stub(router, 'Router').returns(routerInstance);
    });

    afterEach(function() {
      Cosmos.render.restore();

      router.Router.restore();
    });

    it('should instantiate the Router', function() {
      Cosmos.start();

      expect(router.Router.callCount).to.equal(1);
    });

    it('should pass options to Router constructor', function() {
      var args = [{defaultProps: {prop: true}, container: '<div>'}];

      Cosmos.start.apply(Cosmos, args);

      expect(router.Router.lastCall.args[0].defaultProps.prop).to.equal(true);
      expect(router.Router.lastCall.args[0].container).to.equal('<div>');
    });

    it('should attach onRender to Router options', function() {
      Cosmos.start();

      var options = router.Router.lastCall.args[0];
      options.onRender();

      expect(Cosmos.render).to.have.been.called;
    });

    it('should return the Router instance', function() {
      var router = Cosmos.start();

      expect(router).to.equal(routerInstance);
    });
  });
});
