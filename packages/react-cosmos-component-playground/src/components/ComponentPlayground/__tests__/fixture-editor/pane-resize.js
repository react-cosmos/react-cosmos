import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedEditorFixture from '../../__fixtures__/selected-editor';
import ComponentPlayground, { FIXTURE_EDITOR_PANE_SIZE } from '../../';
import localForage from 'localforage';

jest.mock('localforage');

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

    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy]}
          component={ComponentPlayground}
          fixture={selectedEditorFixture}
          onComponentRef={i => {
            instance = i;
            resolve();
          }}
        />
      );
    }).then(mockContentNodeSize);
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
