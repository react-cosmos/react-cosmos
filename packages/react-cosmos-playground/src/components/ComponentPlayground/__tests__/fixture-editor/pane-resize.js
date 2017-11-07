import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import selectedEditorFixture from '../../__fixtures__/selected-editor';
import { FIXTURE_EDITOR_PANE_SIZE } from '../../';
import localForage from 'localforage';

jest.mock('localforage');

const StateProxy = createStateProxy();
const FetchProxy = createFetchProxy();

// Vars populated in beforeEach blocks
let wrapper;
let instance;

const mockContentNodeSize = () => {
  // Fake node width/height
  instance.contentNode = {
    // Landscape
    offsetWidth: 300,
    offsetHeight: 200
  };
};

describe('Resize fixture editor pane', () => {
  const cachedSize = 270;

  beforeEach(() => {
    localForage.__setItemMocks({
      [FIXTURE_EDITOR_PANE_SIZE]: cachedSize
    });

    // Mount component in order for ref and lifecycle methods to be called
    wrapper = mount(
      <Loader
        proxies={[StateProxy, FetchProxy]}
        fixture={selectedEditorFixture}
        onComponentRef={i => {
          instance = i;
          mockContentNodeSize();
        }}
      />
    );

    // Wait for async actions in componentDidMount to complete
    return new Promise(resolve => {
      setImmediate(() => {
        wrapper.update();
        resolve();
      });
    });
  });

  it('should set landscape class to content', () => {
    expect(wrapper.find('.content.contentLandscape')).toHaveLength(1);
  });

  it('should set cached fixture editor pane width', () => {
    expect(wrapper.find('.fixtureEditorPane').prop('style').width).toBe(
      cachedSize
    );
  });

  describe('from landscape to portrait', () => {
    beforeEach(() => {
      instance.contentNode = {
        // Portrait
        offsetWidth: 200,
        offsetHeight: 300
      };
      instance.onResize();
      wrapper.update();
    });

    it('should set portrait class to content', () => {
      expect(wrapper.find('.content.contentPortrait')).toHaveLength(1);
    });

    it('should set cached fixture editor pane height', () => {
      expect(wrapper.find('.fixtureEditorPane').prop('style').height).toBe(
        cachedSize
      );
    });
  });
});
