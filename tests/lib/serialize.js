var serialize = require('../../lib/serialize.js');

describe('Serialize lib', function() {
  it('should generate props object from query string', function() {
    queryString = 'component=List&dataUrl=users.json';
    props = serialize.getPropsFromQueryString(queryString);

    expect(props.component).to.equal('List');
    expect(props.dataUrl).to.equal('users.json');
  });

  it('should decode encoded params from query string', function() {
    queryString = 'component=List&prop=words%20with%20spaces';
    props = serialize.getPropsFromQueryString(queryString);

    expect(props.component).to.equal('List');
    expect(props.prop).to.equal('words with spaces');
  });

  it('should parse stringified JSON from query string', function() {
    queryString = 'component=List&prop=' +
                  '%7B%22iam%22%3A%7B%22nested%22%3Atrue%7D%7D';
    props = serialize.getPropsFromQueryString(queryString);

    expect(props.component).to.equal('List');
    expect(props.prop.iam.nested).to.equal(true);
  });

  it('should generate query string from props', function() {
    props = {
      component: 'List',
      dataUrl: 'users.json'
    };
    queryString = serialize.getQueryStringFromProps(props);

    expect(queryString).to.equal('component=List&dataUrl=users.json');
  });

  it('should encode params in query string', function() {
    props = {
      component: 'List',
      prop: 'word with spaces'
    };
    queryString = serialize.getQueryStringFromProps(props);

    expect(queryString).to.equal('component=List&prop=word%20with%20spaces');
  });

  it('should stringify JSON in query string', function() {
    props = {
      component: 'List',
      prop: {
        iam: {
          nested: true
        }
      }
    };
    queryString = serialize.getQueryStringFromProps(props);

    expect(queryString).to.equal('component=List&prop=' +
                                 '%7B%22iam%22%3A%7B%22nested%22%3Atrue%7D%7D');
  });
});
