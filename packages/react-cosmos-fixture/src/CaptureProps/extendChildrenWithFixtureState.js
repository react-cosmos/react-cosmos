// @flow

import {
  extendObjectWithValues,
  getPropsFixtureState,
  createElFxStateMatcher
} from 'react-cosmos-shared2/fixtureState';
import { setElementAtPath } from '../shared/childrenTree';
import { DEFAULT_RENDER_KEY } from './shared';
import { findRelevantElementPaths } from './findRelevantElementPaths';

import type {
  FixtureDecoratorId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { Children } from '../shared/childrenTree';

export function extendChildrenWithFixtureState(
  children: Children,
  fixtureState: ?FixtureState,
  decoratorId: FixtureDecoratorId
): Children {
  const elPaths = findRelevantElementPaths(children);

  return elPaths.reduce((extendedChildren, elPath): Children => {
    const [propsFxState] = getPropsFixtureState(
      fixtureState,
      createElFxStateMatcher(decoratorId, elPath)
    );

    return setElementAtPath(extendedChildren, elPath, element => {
      if (!propsFxState) {
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
      const { renderKey } = propsFxState;

      return {
        ...element,
        props: extendObjectWithValues(props, propsFxState.values),
        key: getElRenderKey(elPath, renderKey)
      };
    });
  }, children);
}

function getElRenderKey(elPath, renderKey) {
  return `${elPath}-${renderKey}`;
}
