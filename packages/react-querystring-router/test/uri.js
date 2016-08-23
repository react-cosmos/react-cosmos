var _ = require('lodash'),
    uri = require('../src/uri.js');

describe('uri lib', function() {
  it('should return empty object when querystring is missing', function() {
    var uriLocation = 'mypage.com';
    var params = uri.parseLocation(uriLocation);

    expect(_.keys(params).length).to.equal(0);
  });

  it('should return empty object when querystring is empty', function() {
    var uriLocation = 'mypage.com?';
    var params = uri.parseLocation(uriLocation);

    expect(_.keys(params).length).to.equal(0);
  });

  it('should parse stringified and encoded props from location', function() {
    var uriLocation = 'mypage.com?name=Jack&info=%7B%22age%22%3A25%7D';
    var params = uri.parseLocation(uriLocation);

    expect(params.name).to.equal('Jack');
    expect(params.info.age).to.equal(25);
  });

  it('should generate location with query string from params', function() {
    var params = {
      name: 'Jack',
      info: {
        age: 25
      }
    };

    expect(uri.stringifyParams(params)).
        to.equal('?name=Jack&info=%7B%22age%22%3A25%7D');
  });
});
