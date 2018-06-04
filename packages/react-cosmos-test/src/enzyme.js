// @flow

import { mount as mountEnzyme } from 'enzyme';
import { createContext as createGenericContext } from './generic';

import type { ComponentType } from 'react';
import type {
  Wrapper,
  ContextFunctions,
  EnzymeContextArgs
} from 'react-cosmos-flow/context';

type Selector = string | ComponentType<*>;

type EnzymeWrapper = Wrapper & {
  update: () => any,
  setProps: Object => any,
  find: (selector: ?Selector) => EnzymeWrapper
};

// From the Flow docs: "But when you have properties that overlap by having the
// same name, it creates an intersection of the property type as well."
// Thus we ensure that getWrapper is not an intersection of
// ContextFunctions.getWrapper & EnzymeContextFunctions.getWrapper
type BaseContextFunctions = $Diff<
  ContextFunctions,
  { getWrapper: () => Wrapper }
>;

type EnzymeContextFunctions = BaseContextFunctions & {
  getRootWrapper: () => EnzymeWrapper,
  getWrapper: (selector: ?Selector) => EnzymeWrapper,
  set: (fixtureKey: string, fixtureValue: Object) => any,
  setProps: Object => any
};

export function createContext(args: EnzymeContextArgs): EnzymeContextFunctions {
  const context = createGenericContext({
    ...args,
    renderer: mountEnzyme
  });
  const { mount, unmount, getRef, get, getField } = context;

  function getRootWrapper(): EnzymeWrapper {
    const wrapper = wrapWrapper(context.getWrapper());

    // Ensure the returned wrapper is always up to date
    wrapper.update();

    return wrapper;
  }

  function getWrapper(selector: ?Selector): EnzymeWrapper {
    const { fixture } = args;
    const innerWrapper = getRootWrapper().find(fixture.component);

    return selector ? innerWrapper.find(selector) : innerWrapper;
  }

  function setProps(newProps: Object) {
    const { fixture } = args;
    const prevProps = fixture.props || {};
    const updatedFixture = {
      ...fixture,
      props: {
        ...prevProps,
        ...newProps
      }
    };
    getRootWrapper().setProps({ fixture: updatedFixture });
  }

  function set(key: string, valueToReplace: any) {
    const { fixture } = args;
    const updatedFixture = {
      ...fixture,
      [key]: valueToReplace
    };
    getRootWrapper().setProps({ fixture: updatedFixture });
  }

  return {
    mount,
    unmount,
    getRef,
    get,
    getField,
    getRootWrapper,
    getWrapper,
    set,
    setProps
  };
}

// Sorry Flow: I don't know how to show you that the wrapper is already an
// EnzymeWrapper
function wrapWrapper(wrapper: any): EnzymeWrapper {
  if (typeof wrapper.update !== 'function') {
    throw new TypeError('update method missing on Enzyme wrapper');
  }
  if (typeof wrapper.find !== 'function') {
    throw new TypeError('find method missing on Enzyme wrapper');
  }

  return wrapper;
}
