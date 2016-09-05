/* eslint-env node, mocha */
/* global expect, sinon */

import _ from 'lodash';
import uri from '../src/uri.js';

describe('uri lib', () => {
  it('should return empty object when querystring is missing', () => {
    const uriLocation = 'mypage.com';
    const params = uri.parseLocation(uriLocation);

    expect(_.keys(params).length).to.equal(0);
  });

  it('should return empty object when querystring is empty', () => {
    const uriLocation = 'mypage.com?';
    const params = uri.parseLocation(uriLocation);

    expect(_.keys(params).length).to.equal(0);
  });

  it('should parse stringified and encoded props from location', () => {
    const uriLocation = 'mypage.com?name=Jack&info=%7B%22age%22%3A25%7D';
    const params = uri.parseLocation(uriLocation);

    expect(params.name).to.equal('Jack');
    expect(params.info.age).to.equal(25);
  });

  it('should generate location with query string from params', () => {
    const params = {
      name: 'Jack',
      info: {
        age: 25,
      },
    };

    expect(uri.stringifyParams(params))
        .to.equal('?name=Jack&info=%7B%22age%22%3A25%7D');
  });
});
