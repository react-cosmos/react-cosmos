var serialize = require('../../../lib/serialize.js'),
    router = require('../../../lib/router'),
    url = router.url,
    Router = router.Router;

describe('Router class', function() {
  var componentInstance = {},
      onRenderSpy = sinon.spy(function() {
        return componentInstance;
      });

  beforeEach(function() {
    sinon.stub(url, 'getParams').returns({
      component: 'List',
      dataUrl: 'users.json'
    });

    // Ignore window APIs
    sinon.stub(Router.prototype, '_bindPopStateEvent');
  });

  afterEach(function() {
    url.getParams.restore();

    Router.prototype._bindPopStateEvent.restore();

    onRenderSpy.reset();
  });

  describe('new instance', function() {
    it('should request URL params', function() {
      new Router({onRender: onRenderSpy});

      expect(url.getParams).to.have.been.called;
    });

    it('should render using URL params as props', function() {
      new Router({onRender: onRenderSpy});

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('List');
      expect(propsSent.dataUrl).to.equal('users.json');
    });

    it('should extend default props', function() {
      new Router({
        onRender: onRenderSpy,
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
      var routerInstance = new Router({onRender: onRenderSpy});

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(routerInstance);
    });

    it('should default to document.body as container', function() {
      new Router({onRender: onRenderSpy});

      expect(onRenderSpy.lastCall.args[1]).to.equal(document.body);
    });

    it('should use container node received in options', function() {
      var container = document.createElement('div');
      new Router({
        onRender: onRenderSpy,
        container: container
      });

      expect(onRenderSpy.lastCall.args[1]).to.equal(container);
    });

    it('should expose reference to root component', function() {
      var router = new Router({onRender: onRenderSpy});

      expect(router.rootComponent).to.equal(componentInstance);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      new Router({
        onRender: onRenderSpy,
        onChange: onChangeSpy
      });

      var propsSent = onChangeSpy.lastCall.args[0];

      expect(propsSent.component).to.equal('List');
      expect(propsSent.dataUrl).to.equal('users.json');
    });
  });

  describe('.goTo method', function() {
    beforeEach(function() {
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

      sinon.stub(serialize, 'getPropsFromQueryString').returns({
        component: 'User',
        dataUrl: 'user.json'
      });

      sinon.stub(url, 'isPushStateSupported').returns(true);

      // Ignore window APIs
      sinon.stub(Router.prototype, '_replaceHistoryState');
      sinon.stub(Router.prototype, '_pushHistoryState');
    });

    afterEach(function() {
      serialize.getPropsFromQueryString.restore();

      url.isPushStateSupported.restore();

      Router.prototype._replaceHistoryState.restore();
      Router.prototype._pushHistoryState.restore();
    });

    it('should check if pushState is supported', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('');

      expect(url.isPushStateSupported).to.have.been.called;
    });

    it('should send query string to URL lib', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('my-page?component=User&dataUrl=user.json');

      expect(serialize.getPropsFromQueryString)
            .to.have.been.calledWith('component=User&dataUrl=user.json');
    });

    it('should render using props returned by URL lib', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('my-page?component=User&dataUrl=user.json');

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });

    it('should extend default props', function() {
      var router = new Router({
        onRender: onRenderSpy,
        defaultProps: {
          component: 'DefaultComponent',
          defaultProp: true
        }
      });

      router.goTo('my-page?component=User&dataUrl=user.json');

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('');

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(router);
    });

    it('should push new props to browser history', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('my-page?component=User&dataUrl=user.json');

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      var propsSent = router._pushHistoryState.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });

    it('should generate snapshot of previous component', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('my-page?component=User&dataUrl=user.json');

      expect(componentInstance.serialize).to.have.been.called;
    });

    it('should update browser history for previous component', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('my-page?component=User&dataUrl=user.json');

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      var propsSent = router._replaceHistoryState.lastCall.args[0];
      expect(propsSent.component).to.equal('List');
      expect(propsSent.dataUrl).to.equal('users.json');
      expect(propsSent.state.somethingHappened).to.equal(true);
    });

    it('should not push default props to browser history', function() {
      var router = new Router({
        onRender: onRenderSpy,
        defaultProps: {
          component: 'List'
        }
      });

      router.goTo('my-page?component=User&dataUrl=user.json');

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      var propsSent = router._replaceHistoryState.lastCall.args[0];
      expect(propsSent.component).to.equal(undefined);
    });

    it('should not push router instance to browser history', function() {
      var router = new Router({onRender: onRenderSpy});

      router.goTo('my-page?component=User&dataUrl=user.json');

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      var propsSent = router._replaceHistoryState.lastCall.args[0];
      expect(propsSent.router).to.equal(undefined);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy(),
          router = new Router({
            onRender: onRenderSpy,
            onChange: onChangeSpy
          });

      router.goTo('my-page?component=User&dataUrl=user.json');

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });
  });

  describe('.PopState event', function() {
    it('should use props from event state', function() {
      var router = new Router({onRender: onRenderSpy});

      router.onPopState({
        state: {
          component: 'User',
          dataUrl: 'user.json'
        }
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });

    it('should extend default props', function() {
      var router = new Router({
        onRender: onRenderSpy,
        defaultProps: {
          component: 'DefaultComponent',
          defaultProp: true
        }
      });

      router.onPopState({
        state: {
          component: 'User',
          dataUrl: 'user.json'
        }
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
      expect(propsSent.defaultProp).to.equal(true);
    });

    it('should attach router reference to props', function() {
      var router = new Router({onRender: onRenderSpy});

      router.onPopState({
        state: {
          component: 'User',
          dataUrl: 'user.json'
        }
      });

      var propsSent = onRenderSpy.lastCall.args[0];
      expect(propsSent.router).to.equal(router);
    });

    it('should call onChange callback', function() {
      var onChangeSpy = sinon.spy();
      var router = new Router({
        onRender: onRenderSpy,
        onChange: onChangeSpy
      });

      router.onPopState({
        state: {
          component: 'User',
          dataUrl: 'user.json'
        }
      });

      var propsSent = onChangeSpy.lastCall.args[0];
      expect(propsSent.component).to.equal('User');
      expect(propsSent.dataUrl).to.equal('user.json');
    });
  });
});
