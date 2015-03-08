var _ = require('lodash'),
    ClassNameMixin = require('../../mixins/class-name.js');

describe('ClassName mixin', function() {
  var fakeComponent;

  beforeEach(function() {
    fakeComponent = _.clone(ClassNameMixin);

    // Mock React API
    fakeComponent.props = {};
  });

  it('should not return a class name when none is received', function() {
    expect(fakeComponent.getClassName()).to.equal(undefined);
  });

  it('should return a class name when class prop is passed', function() {
    fakeComponent.props.className = 'my-class';

    expect(fakeComponent.getClassName()).to.equal('my-class');
  });

  it('should return default class name when passed', function() {
    expect(fakeComponent.getClassName('default-class'))
          .to.equal('default-class');
  });

  it('should override default class with class from props', function() {
    fakeComponent.props.className = 'my-class';

    expect(fakeComponent.getClassName('default-class'))
          .to.equal('my-class');
  });
});
