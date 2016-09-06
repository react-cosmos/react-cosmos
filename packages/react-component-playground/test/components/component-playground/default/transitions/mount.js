const FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, function () {
  var React = require('react'),
    ReactDOM = require('react-dom-polyfill')(React),
    render = require('helpers/render-component.js'),
    fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
    $component,
    container,
    fixture;

  const timeoutId = 555;

  beforeEach(function () {
    sinon.stub(window, 'setInterval').returns(timeoutId);
    sinon.stub(window, 'clearInterval');
    sinon.stub(window, 'addEventListener');
    sinon.stub(window, 'removeEventListener');

    ({ container, component, $component } = render(fixture));
  });

  afterEach(function () {
    window.setInterval.restore();
    window.clearInterval.restore();
    window.addEventListener.restore();
    window.removeEventListener.restore();
  });

  it('should register fixture update interval on mount', function () {
    const setIntervalArgs = window.setInterval.lastCall.args;
    expect(setIntervalArgs[0]).to.equal(component.onFixtureUpdate);
    expect(setIntervalArgs[1]).to.equal(100);
  });

  it('should clear fixture update interval on unmount', function () {
    ReactDOM.unmountComponentAtNode(container);

    expect(window.clearInterval).to.have.been.calledWith(timeoutId);
  });

  it('should add window resize listener on mount', function () {
    expect(window.addEventListener).to.have.been.calledWith(
        'resize', component.onWindowResize);
  });

  it('should remove window resize listener on unmount', function () {
    ReactDOM.unmountComponentAtNode(container);

    expect(window.removeEventListener).to.have.been.calledWith(
        'resize', component.onWindowResize);
  });

  describe('default state', function () {
    it('should have empty fixture contents', function () {
      expect(component.state.fixtureContents).to.deep.equal({});
    });

    it('should have empty object literal in fixture user input', function () {
      expect(component.state.fixtureUserInput).to.equal('{}');
    });

    it('should have fixture user input marked as valid', function () {
      expect(component.state.isFixtureUserInputValid).to.equal(true);
    });

    it('should have fixture change counter set to 0', function () {
      expect(component.state.fixtureChange).to.equal(0);
    });

    it('should have fixture editor marked as not focused', function () {
      expect(component.state.isEditorFocused).to.equal(false);
    });

    it('should have landscape orientation', function () {
      expect(component.state.orientation).to.equal('landscape');
    });
  });
});
