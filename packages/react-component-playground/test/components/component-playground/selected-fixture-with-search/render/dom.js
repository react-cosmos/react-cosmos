var FIXTURE = 'selected-fixture-with-search';
var style = require('component-playground/components/component-playground.less');

describe(`ComponentPlayground (${FIXTURE}) Render DOM`, function() {
  var $ = require('jquery'),
      render = require('helpers/render-component.js'),
      fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
      $component,
      container,
      fixture;

  beforeEach(function() {
    ({container, component, $component} = render(fixture));
  });

  it('should render the second component based on search value', function() {
    expect(component.refs['componentName-SecondComponent']).to.exist;
  });

  it('should render the second component based on search value', function() {
    expect(component.refs['fixtureButton-SecondComponent-index']).to.exist;
  });

  it('should leave the component with the selected fixture', function() {
    expect(component.refs['componentName-FirstComponent']).to.exist;
  });
});
