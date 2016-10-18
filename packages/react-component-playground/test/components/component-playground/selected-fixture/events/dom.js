const FIXTURE = 'selected-fixture';

describe(`ComponentPlayground (${FIXTURE}) Events DOM`, () => {
  const utils = require('react-addons-test-utils');
  const _ = require('lodash');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  const stubbedFixture = _.assign({}, fixture, {
    router: {
      goTo: sinon.spy(),
      routeLink: sinon.spy(),
    },
  });

  beforeEach(() => {
    ({ container, component, $component } = render(stubbedFixture));
  });

  afterEach(() => {
    stubbedFixture.router.goTo.reset();
    stubbedFixture.router.routeLink.reset();
  });

  it('should route link on home button', () => {
    utils.Simulate.click(component.refs.homeButton);

    expect(component.props.router.routeLink).to.have.been.called;
  });

  it('should route link on editor button', () => {
    utils.Simulate.click(component.refs.editorButton);

    expect(component.props.router.routeLink).to.have.been.called;
  });

  it('should route link on full screen button', () => {
    utils.Simulate.click(component.refs.fullScreenButton);

    expect(component.props.router.routeLink).to.have.been.called;
  });

  it('should route link on new fixture button', () => {
    utils.Simulate.click(
        component.refs['fixtureButton-FirstComponent-error']);

    expect(component.props.router.goTo).to.have.been.called;
  });

  describe('Clicking button of already selected fixture', () => {
    let stateSet;

    beforeEach(() => {
      sinon.spy(component, 'setState');

      utils.Simulate.click(
          component.refs['fixtureButton-FirstComponent-default']);

      stateSet = component.setState.lastCall.args[0];
    });

    beforeEach(() => {
      component.setState.restore();
    });

    it('should not route link', () => {
      expect(component.props.router.goTo).to.not.have.been.called;
    });

    it('should reset state', () => {
      const fixtureContents = _.omit(
          fixture.fixtures.FirstComponent.default,
          _.keys(component.state.fixtureUnserializableProps));

      expect(stateSet.fixtureContents).to.deep.equal(fixtureContents);
      expect(stateSet.fixtureUserInput).to.equal(
          JSON.stringify(fixtureContents, null, 2));
      expect(stateSet.isFixtureUserInputValid).to.equal(true);
    });

    it('should bump fixture change', () => {
      expect(stateSet.fixtureChange).to.equal(fixture.state.fixtureChange + 1);
    });
  });
});
