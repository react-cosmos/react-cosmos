import until from 'async-until';
import { createContext, afterPendingTimers } from '../../../../utils/enzyme';
import FixtureEditor from '../../../FixtureEditor';
import fixture from '../../__fixtures__/selected-editor';

const postMessage = jest.fn();

const { mount, getWrapper } = createContext({
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

describe('Fixture editor', () => {
  beforeEach(async () => {
    await mount();

    window.postMessage(
      {
        type: 'fixtureLoad',
        fixtureBody: {
          foo: 'bar'
        }
      },
      '*'
    );

    // postMessage is async, but should be received by next loop
    await afterPendingTimers();
  });

  it('sends initial fixture body as value to FixtureEditor', () => {
    expect(getWrapper(FixtureEditor).prop('value')).toEqual({
      foo: 'bar'
    });
  });

  describe('on fixture update from Loader', () => {
    beforeEach(async () => {
      window.postMessage(
        {
          type: 'fixtureUpdate',
          fixtureBody: {
            baz: 'qux'
          }
        },
        '*'
      );

      // postMessage is async, but should be received by next loop
      await afterPendingTimers();
    });

    it('sends updated fixture body as value to FixtureEditor', () => {
      expect(getWrapper(FixtureEditor).prop('value')).toEqual({
        foo: 'bar',
        baz: 'qux'
      });
    });
  });

  describe('on fixture edit from editor', () => {
    beforeEach(() => {
      getWrapper(FixtureEditor)
        .props()
        .onChange({
          foo: 'baz'
        });
    });

    it('sends edited fixture body to Loader', () => {
      expect(postMessage).toHaveBeenCalledWith(
        {
          type: 'fixtureEdit',
          fixtureBody: {
            foo: 'baz'
          }
        },
        '*'
      );
    });
  });
});
