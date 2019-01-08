// @flow

import {
  DEFAULT_RENDER_KEY,
  extendObjWithValues,
  findCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { setElementAtPath } from './nodeTree';
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

  return elPaths.reduce((extendedChildren, elPath): Node => {
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    return setElementAtPath(extendedChildren, elPath, element => {
      if (!compFxState || !compFxState.props) {
        return {
          ...element,
          key: getElRenderKey(elPath, DEFAULT_RENDER_KEY)
        };
      }

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
      const { props } = element;

      return {
        ...element,
        props: extendObjWithValues(props, compFxState.props),
        key: getElRenderKey(elPath, compFxState.renderKey)
      };
    });
  }, node);
}

function getElRenderKey(elPath, renderKey) {
  return `${elPath}-${renderKey}`;
}
