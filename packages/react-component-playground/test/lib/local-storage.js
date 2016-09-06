const localStorageLib = require('component-playground/lib/local-storage.js');

describe('Local storage lib', function () {
  beforeEach(function () {
    sinon.stub(localStorage, 'getItem');
    sinon.stub(localStorage, 'setItem');
  });

  afterEach(function () {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
    localStorage.clear();
  });

  it('should call localStorage get on lib get', function () {
    localStorageLib.get();

    expect(localStorage.getItem).to.have.been.called;
  });

  it('should return null on local storage get error', function () {
    localStorage.getItem.throws();

    expect(localStorageLib.get()).to.be.null;
  });

  it('should return null on parsing error', function () {
    localStorageLib.set('foo', { foo: 'bar' });

    expect(localStorageLib.get('foo')).to.be.null;
  });

  it('should call localStorage set on lib set', function () {
    localStorageLib.set();

    expect(localStorage.setItem).to.have.been.called;
  });

  it('should return null on local storage set error', function () {
    localStorage.setItem.throws();

    expect(localStorageLib.set()).to.be.null;
  });
});
