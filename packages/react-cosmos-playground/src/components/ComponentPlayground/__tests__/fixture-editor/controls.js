import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedEditorFixture from '../../__fixtures__/selected-editor';
import DragHandle from '../../../DragHandle';

// Vars populated in beforeEach blocks
let wrapper;

describe('Fixture editor controls', () => {
  // Fixture editor is already on so the button will untoggle it
  const fixtureEditorUrl = '?component=ComponentA&fixture=foo';

  beforeEach(() => {
    // Mount component in order for ref and lifecycle methods to be called
    wrapper = mount(
      <Loader proxies={[createStateProxy()]} fixture={selectedEditorFixture} />
    );
  });

  it('should set untoggle URL to fixture editor button', () => {
    expect(wrapper.find(`.header a[href="${fixtureEditorUrl}"]`)).toHaveLength(
      1
    );
  });

  it('should render selected fixture editor button', () => {
    expect(
      wrapper.find(`.header a[href="${fixtureEditorUrl}"].selectedButton`)
    ).toHaveLength(1);
  });

  it('should render DragHandle in fixture editor pane', () => {
    expect(wrapper.find('.fixtureEditorPane').find(DragHandle)).toHaveLength(1);
  });
});
