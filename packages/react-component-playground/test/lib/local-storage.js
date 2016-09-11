const localStorageLib = require('component-playground/lib/local-storage');

describe('Local storage lib', () => {
  beforeEach(() => {
    sinon.stub(localStorage, 'getItem');
    sinon.stub(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
    localStorage.clear();
  });

  it('should call localStorage get on lib get', () => {
    localStorageLib.get();

    expect(localStorage.getItem).to.have.been.called;
  });

  it('should return null on local storage get error', () => {
    localStorage.getItem.throws();

    expect(localStorageLib.get()).to.be.null;
  });

  it('should return null on parsing error', () => {
    localStorageLib.set('foo', { foo: 'bar' });

    expect(localStorageLib.get('foo')).to.be.null;
  });

  it('should call localStorage set on lib set', () => {
    localStorageLib.set();

    expect(localStorage.setItem).to.have.been.called;
  });

  it('should return null on local storage set error', () => {
    localStorage.setItem.throws();

    expect(localStorageLib.set()).to.be.null;
  });
});
