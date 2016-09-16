import reduxProxy from '../src/index.jsx';

const FIXTURE = 'default';

describe('Redux Proxy', () => {
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/redux-proxy/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture,
        document.createElement('div'),
        reduxProxy()
      ));
  });

  it('should render its child', () => {
    expect(component.refs.divcomponent).to.exist;
  });

  it('should attach correct store to context down to component', () => {
    const expectedStore = { foo: 'bar' };

    expect(component.refs.divcomponent.context.store.getState()).to.deep.equal(expectedStore);
  });
});
