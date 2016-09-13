import React from 'react';
import uri from '../src/uri.js';
import Router from '../src/router.js';

const ReactDOM = require('react-dom-polyfill')(React);

describe('Router class', () => {
  const ComponentClass = {};
  const componentInstance = {};
  let routerOptions;
  let routerInstance;
  let uriLocation;
  let uriParams;

  const stubWindowApi = () => {
    sinon.stub(Router.prototype, 'getCurrentLocation', () => uriLocation);
    sinon.stub(Router.prototype, 'isPushStateSupported').returns(true);
    sinon.stub(Router.prototype, 'bindPopStateEvent');
    sinon.stub(Router.prototype, 'unbindPopStateEvent');
    sinon.stub(Router.prototype, 'pushHistoryState');
  };

  const restoreWindowApi = () => {
    Router.prototype.getCurrentLocation.restore();
    Router.prototype.isPushStateSupported.restore();
    Router.prototype.bindPopStateEvent.restore();
    Router.prototype.unbindPopStateEvent.restore();
    Router.prototype.pushHistoryState.restore();
  };

  const genericTests = () => {
    it('should unserialize location', () => {
      expect(uri.parseLocation.lastCall.args[0]).to.equal(uriLocation);
    });

    it('should call getComponentClass with params', () => {
      const propsSent = routerOptions.getComponentClass.lastCall.args[0];
      expect(propsSent.component).to.equal(uriParams.component);
      expect(propsSent.dataUrl).to.equal(uriParams.dataUrl);
    });

    it('should call getComponentClass with default props', () => {
      const propsSent = routerOptions.getComponentClass.lastCall.args[0];
      expect(propsSent.defaultProp)
            .to.equal(routerOptions.defaultProps.defaultProp);
    });

    it('should call createElement with returned class', () => {
      expect(React.createElement.lastCall.args[0]).to.equal(ComponentClass);
    });

    it('should render using URL params as props', () => {
      const propsSent = React.createElement.lastCall.args[1];
      expect(propsSent.dataUrl).to.equal(uriParams.dataUrl);
    });

    it('should attach router reference to props', () => {
      expect(React.createElement.lastCall.args[1].router)
            .to.equal(routerInstance);
    });

    it('should extend default props', () => {
      const props = React.createElement.lastCall.args[1];
      expect(props.dataUrl).to.equal(uriParams.dataUrl);
      expect(props.defaultProp).to.equal(true);
    });

    it('should use container node received in options', () => {
      expect(ReactDOM.render.lastCall.args[1]).to.equal('<fake DOM element>');
    });

    it('should expose reference to root component', () => {
      expect(routerInstance.rootComponent).to.equal(componentInstance);
    });

    it('should call onChange callback with params', () => {
      const params = routerOptions.onChange.lastCall.args[0];
      expect(params.component).to.equal(uriParams.component);
      expect(params.dataUrl).to.equal(uriParams.dataUrl);
    });

    it('should call onChange callback with default props', () => {
      const params = routerOptions.onChange.lastCall.args[0];
      expect(params.defaultProp)
            .to.equal(routerOptions.defaultProps.defaultProp);
    });
  };

  const currentLocationTests = () => {
    it('should get current location', () => {
      expect(routerInstance.getCurrentLocation).to.have.been.called;
    });
  };

  const pushLocationTests = () => {
    it('should check if pushState is supported', () => {
      expect(routerInstance.isPushStateSupported).to.have.been.called;
    });

    it('should push new entry to browser history', () => {
      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      // expect(routerInstance.pushHistoryState).to.have.been.called;
      expect(routerInstance.pushHistoryState.lastCall.args[1])
          .to.equal(uriLocation);
    });
  };

  beforeEach(() => {
    stubWindowApi();

    sinon.stub(uri, 'parseLocation', () => uriParams);

    sinon.stub(React, 'createElement');
    sinon.stub(ReactDOM, 'render', () => componentInstance);

    // Fake browser location and mock (already tested) uri.js lib
    uriLocation = 'mypage.com?component=List&dataUrl=users.json';

    uriParams = {
      component: 'List',
      dataUrl: 'users.json',
    };

    routerOptions = {
      defaultProps: {
        defaultProp: true,
      },
      container: '<fake DOM element>',
      getComponentClass: sinon.stub().returns(ComponentClass),
      onChange: sinon.spy(),
    };

    routerInstance = new Router(routerOptions);
  });

  afterEach(() => {
    restoreWindowApi();

    uri.parseLocation.restore();

    React.createElement.restore();
    ReactDOM.render.restore();
  });

  describe('initial location', () => {
    currentLocationTests();
    genericTests();
  });

  describe('changing location', () => {
    beforeEach(() => {
      uriLocation = 'mypage.com?component=User&dataUrl=user.json';

      uriParams = {
        component: 'User',
        dataUrl: 'user.json',
      };
    });

    describe('.goTo method', () => {
      beforeEach(() => {
        routerInstance.goTo(uriLocation);
      });

      pushLocationTests();
      genericTests();
    });

    describe('.routeLink method', () => {
      beforeEach(() => {
        routerInstance.routeLink({
          preventDefault: () => {},
          currentTarget: {
            href: uriLocation,
          },
        });
      });

      pushLocationTests();
      genericTests();
    });

    describe('PopState event', () => {
      beforeEach(() => {
        routerInstance.onPopState({
          state: {},
        });
      });

      currentLocationTests();
      genericTests();
    });

    describe('Empty PopState event', () => {
      beforeEach(() => {
        routerInstance.onPopState({
          state: null,
        });
      });

      currentLocationTests();
      genericTests();
    });
  });
});
