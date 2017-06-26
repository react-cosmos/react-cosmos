import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedEditorFixture from '../__fixtures__/selected-editor';
import DragHandle from '../../DragHandle';
import ComponentPlayground, { LEFT_NAV_SIZE } from '../';
import localForage from 'localforage';

jest.mock('localforage');

// Vars populated in beforeEach blocks
let wrapper;

describe('CP selected with fixture editor pane open', () => {
  // Fixture editor is already on so the button will untoggle it
  const fixtureEditorUrl = '/?component=ComponentA&fixture=foo';

  describe('default size', () => {
    beforeEach(() => {
      return new Promise(resolve => {
        // Mount component in order for ref and lifecycle methods to be called
        wrapper = mount(
          <Loader
            proxies={[createStateProxy]}
            component={ComponentPlayground}
            fixture={selectedEditorFixture}
            onComponentRef={() => {
              resolve();
            }}
          />
        );
      });
    });

    test('should set untoggle URL to fixture editor button', () => {
      expect(wrapper.find(`.header a[href="${fixtureEditorUrl}"]`).length).toBe(
        1
      );
    });

  });
});
