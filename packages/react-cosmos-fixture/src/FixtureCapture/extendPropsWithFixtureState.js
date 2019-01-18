// @flow

import {
  DEFAULT_RENDER_KEY,
  extendObjWithValues,
  findCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { setElementAtPath, getChildrenPath } from './nodeTree';
import { getComponentName } from './getComponentName';
import { findRelevantElementPaths } from './findRelevantElementPaths';

import type { Node } from 'react';
import type {
  FixtureDecoratorId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';

export function extendPropsWithFixtureState(
  node: Node,
  fixtureState: null | FixtureState,
  decoratorId: FixtureDecoratorId
): Node {
  const elPaths = findRelevantElementPaths(node);

  return elPaths.reduce((extendedNode, elPath): Node => {
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    return setElementAtPath(extendedNode, elPath, element => {
      if (
        !compFxState ||
        !compFxState.props ||
        componentTypeChanged(compFxState.componentName)
      ) {
        return {
          ...element,
          key: getElRenderKey(elPath, DEFAULT_RENDER_KEY)
        };
      }

      // Prevent overriding child elements with outdated "children" prop values
      // stored in fixture state
      const originalProps = element.props;
      const extendedProps = extendObjWithValues(
        originalProps,
        compFxState.props
      );

      // HACK alert: Editing React Element by hand
      // This is blasphemy, but there are two reasons why React.cloneElement
      // isn't ideal:
      //   1. Props need to overridden (not merged)
      //   2. element.key has to be set to control whether the prev instance
      //      should be reused on not
      // Still, in case this method causes trouble in the future, both reasons
      // can be overcome in the following ways:
      //   1. Set original props that aren't present in fixture state to
      //      undefined
      //   2. Create a wrapper component or element and to set the key on
      // Useful links:
      //   - https://reactjs.org/docs/react-api.html#cloneelement
      //   - https://github.com/facebook/react/blob/15a8f031838a553e41c0b66eb1bcf1da8448104d/packages/react/src/ReactElement.js#L293-L362
      return {
        ...element,
        props: hasChildElPaths(elPaths, elPath)
          ? { ...extendedProps, children: originalProps.children }
          : extendedProps,
        key: getElRenderKey(elPath, compFxState.renderKey)
      };

      function componentTypeChanged(componentName) {
        return componentName !== getComponentName(element.type);
      }
    });
  }, node);
}

function getElRenderKey(elPath, renderKey) {
  return `${elPath}-${renderKey}`;
}

function hasChildElPaths(elPaths, elPath) {
  return elPaths.some(p => p.indexOf(getChildrenPath(elPath)) === 0);
}
