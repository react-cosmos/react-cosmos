var serialize = require('../../lib/serialize.js'),
    Router = require('../../lib/router.js').Router;

describe('Router class', function() {
  var componentInstance = {},
      onRenderSpy = sinon.spy(function() {
        return componentInstance;
      });

  var queryString,
      routerOptions,
      routerInstance,
      queryString,
      propsFromQueryString;

  function createRouter(extraOptions) {
    routerInstance = new Router(_.merge(routerOptions, extraOptions));
  };

  beforeEach(function() {
    // Allow query string to be overridden before tests
    queryString = 'mypage.com?component=List&dataUrl=users.json';

    propsFromQueryString = {
      component: 'List',
      dataUrl: 'users.json'
    };

    sinon.stub(serialize, 'getPropsFromQueryString', function() {
      return propsFromQueryString;
    });

    // Ignore window API
    sinon.stub(Router.prototype, '_getCurrentLocation', function() {
      return queryString;
    });
    sinon.stub(Router.prototype, '_isPushStateSupported').returns(true);
    sinon.stub(Router.prototype, '_bindPopStateEvent');
    sinon.stub(Router.prototype, '_unbindPopStateEvent');
    sinon.stub(Router.prototype, '_replaceHistoryState');
    sinon.stub(Router.prototype, '_pushHistoryState');

    routerOptions = {onRender: onRenderSpy};
  });

  afterEach(function() {
    serialize.getPropsFromQueryString.restore();

    Router.prototype._getCurrentLocation.restore();
    Router.prototype._isPushStateSupported.restore();
    Router.prototype._bindPopStateEvent.restore();
    Router.prototype._unbindPopStateEvent.restore();
    Router.prototype._replaceHistoryState.restore();
    Router.prototype._pushHistoryState.restore();

    onRenderSpy.reset();
  });

  describe('new instance', function() {
    it('should get current location', function() {
      createRouter();

      expect(routerInstance._getCurrentLocation).to.have.been.called;
    });

    it('should unserialize current URL', function() {
      createRouter();

      expect(serialize.getPropsFromQueryString).to.have.been.calledWith(
          'component=List&dataUrl=users.json');
    });

    it('should render using URL params as props', function() {
      createRouter();

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('List');
      expect(propsSent.dataUrl).to.equal('users.json');
    });

    it('should extend default props', function() {
      createRouter({
        defaultProps: {
          component: 'DefaultComponent',
          defaultProp: true
        }
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('List');
      expect(propsSent.dataUrl).to.equal('users.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      createRouter();

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should default to document.body as container', function() {
      createRouter();

      expect(onRenderSpy.lastCall.args[1]).to.equal(document.body);
    });

    it('should use container node received in options', function() {
      var container = document.createElement('div');
      createRouter({
        container: container
      });

      expect(onRenderSpy.lastCall.args[1]).to.equal(container);
    });

    it('should expose reference to root component', function() {
      createRouter();

      expect(routerInstance.rootComponent).to.equal(componentInstance);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      createRouter({
        onChange: onChangeSpy
      });

      var propsSent = onChangeSpy.lastCall.args[0];

      expect(propsSent.component).to.equal('List');
      expect(propsSent.dataUrl).to.equal('users.json');
    });
  });

  describe('.goTo method', function() {
    beforeEach(function() {
      queryString = 'mypage.com?component=User&dataUrl=user.json';

      propsFromQueryString = {
        component: 'User',
        dataUrl: 'user.json'
      };

      // Fake the API of the ComponentTree mixin
      componentInstance = {
        serialize: sinon.stub().returns({
          component: 'List',
          dataUrl: 'users.json',
          state: {
            somethingHappened: true
          }
        })
      };
    });

    it('should check if pushState is supported', function() {
      createRouter();

      routerInstance.goTo(queryString);

      expect(routerInstance._isPushStateSupported).to.have.been.called;
    });

    it('should unserialize new URL query string', function() {
      createRouter();

      routerInstance.goTo(queryString);

      expect(serialize.getPropsFromQueryString)
            .to.have.been.calledWith('component=User&dataUrl=user.json');
    });

    it('should render using new URL params as props', function() {
      createRouter();

      routerInstance.goTo(queryString);

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });

    it('should extend default props', function() {
      createRouter({
        defaultProps: {
          component: 'DefaultComponent',
          defaultProp: true
        }
      });

      routerInstance.goTo(queryString);

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      createRouter();

      routerInstance.goTo(queryString);

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should push new entry to browser history', function() {
      createRouter();

      routerInstance.goTo(queryString);

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      expect(routerInstance._pushHistoryState).to.have.been.called;
    });

    it('should generate snapshot of previous component', function() {
      createRouter();

      routerInstance.goTo(queryString);

      expect(componentInstance.serialize).to.have.been.called;
    });

    it('should update browser history with state for previous component',
       function() {
      createRouter();

      routerInstance.goTo(queryString);

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      var stateSent = routerInstance._replaceHistoryState.lastCall.args[0];
      expect(stateSent.somethingHappened).to.equal(true);
    });

    it('should omit unserializable fields for browser state', function() {
      componentInstance.serialize.returns({
        component: 'List',
        dataUrl: 'users.json',
        state: {
          somethingHappened: true,
          somethingElseHappened: true,
          somethingUgly: function() {}
        }
      });

      createRouter();

      routerInstance.goTo(queryString);

      var stateSent = routerInstance._replaceHistoryState.lastCall.args[0];
      expect(stateSent.somethingHappened).to.equal(true);
      expect(stateSent.somethingElseHappened).to.equal(true);
      expect(stateSent.somethingUgly).to.equal(undefined);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      createRouter({
        onChange: onChangeSpy
      });

      routerInstance.goTo(queryString);

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });
  });

  describe('.PopState event', function() {
    beforeEach(function() {
      queryString = 'mypage.com?component=User&dataUrl=user.json';

      propsFromQueryString = {
        component: 'User',
        dataUrl: 'user.json'
      };
    });

    it('should get current location', function() {
      createRouter();

      expect(routerInstance._getCurrentLocation).to.have.been.called;
    });

    it('should unserialize current URL', function() {
      createRouter();

      expect(serialize.getPropsFromQueryString).to.have.been.calledWith(
          'component=User&dataUrl=user.json');
    });

    it('should use state from event state', function() {
      createRouter();

      routerInstance.onPopState({
        state: {
          somethingHappened: true
        }
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.state.somethingHappened).to.equal(true);
    });

    it('should extend default props', function() {
      createRouter({
        defaultProps: {
          component: 'DefaultComponent',
          defaultProp: true
        }
      });

      routerInstance.onPopState({
        state: {}
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      createRouter();

      routerInstance.onPopState({
        state: {}
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      createRouter({
        onChange: onChangeSpy
      });

      routerInstance.onPopState({
        state: {}
      });

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });
  });
});
