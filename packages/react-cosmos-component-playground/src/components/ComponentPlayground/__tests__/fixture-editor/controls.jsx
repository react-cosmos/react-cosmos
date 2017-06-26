import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedEditorFixture from '../../__fixtures__/selected-editor';
import DragHandle from '../../../DragHandle';
import ComponentPlayground from '../../';

jest.mock('localforage');

// Vars populated in beforeEach blocks
let wrapper;
let instance;

describe('Fixture editor controls', () => {
  // Fixture editor is already on so the button will untoggle it
  const fixtureEditorUrl = '/?component=ComponentA&fixture=foo';

  beforeEach(() => {
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
    }).then(() => {
      // Fake node width/height
      instance.contentNode = {
        // Landscape
        offsetWidth: 300,
        offsetHeight: 200,
      };
    });
  });

  it('should set untoggle URL to fixture editor button', () => {
    expect(wrapper.find(`.header a[href="${fixtureEditorUrl}"]`).length).toBe(
      1
    );
  });

  it('should render selected fixture editor button', () => {
    expect(
      wrapper.find(`.header a[href="${fixtureEditorUrl}"].selectedButton`)
        .length
    ).toBe(1);
  });

  it('should render DragHandle in fixture editor pane', () => {
    expect(wrapper.find('.fixtureEditorPane').find(DragHandle).length).toBe(1);
  });
});
