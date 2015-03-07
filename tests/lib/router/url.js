var serialize = require('../../../lib/serialize.js'),
    url = require('../../../lib/router').url;

describe('Url lib', function() {
  beforeEach(function() {
    sinon.stub(serialize, 'getPropsFromQueryString').returns({
      component: 'List',
      dataUrl: 'users.json'
    });

    // Avoid mocking the window API
    sinon.stub(url, 'getQueryString')
         .returns('?component=List&dataUrl=users.json');
  });

  afterEach(function() {
    serialize.getPropsFromQueryString.restore();

    url.getQueryString.restore();
  });

  it('should remove question mark from query string', function() {
    url.getParams();

    expect(serialize.getPropsFromQueryString)
          .to.have.been.calledWith('component=List&dataUrl=users.json');
  });

  it('should return parsed query string props', function() {
    var props = url.getParams();

    expect(props.component).to.equal('List');
    expect(props.dataUrl).to.equal('users.json');
  });
});
