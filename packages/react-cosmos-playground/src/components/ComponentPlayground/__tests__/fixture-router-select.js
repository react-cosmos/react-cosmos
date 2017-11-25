import until from 'async-until';
import { createContext } from '../../../utils/enzyme';
import fixture from '../__fixtures__/ready';

const postMessage = jest.fn();

const { mount, getRootWrapper } = createContext({
  fixture,
  async ref(compInstance) {
    await until(() => compInstance.loaderFrame);
    compInstance.loaderFrame = {
      contentWindow: {
        postMessage
      }
    };
  }
});

describe('CP fixture select via router', () => {
  beforeEach(async () => {
    await mount();

    const { props } = fixture;
    getRootWrapper().setProps({
      fixture: {
        ...fixture,
        props: {
          ...props,
          component: 'ComponentB',
          fixture: 'qux'
        }
      }
    });
  });

  test('sends fixture select message to loader', () => {
    expect(postMessage).toHaveBeenCalledWith(
      {
        type: 'fixtureSelect',
        component: 'ComponentB',
        fixture: 'qux'
      },
      '*'
    );
  });
});
