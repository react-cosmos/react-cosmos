import { ReactNode, useEffect, useRef } from 'react';
import {
  FixtureDecoratorId,
  PropsFixtureState,
  areNodesEqual,
  createFixtureStateProps,
  createValues,
  findFixtureStateProps,
  getComponentName,
  getFixtureStateProps,
  removeFixtureStateProps,
  updateFixtureStateProps,
} from 'react-cosmos-core';
import { useFixtureState } from '../../useFixtureState.js';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths.js';
import {
  getElementAtPath,
  getExpectedElementAtPath,
} from '../shared/nodeTree/index.js';
import { useFixtureProps } from './useFixtureProps.js';

export function usePropsCapture(
  fixture: ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const [propsFs, setPropsFs] = useFixtureState<PropsFixtureState>('props');
  const prevFixtureRef = useRef(fixture);
  const elPaths = findRelevantElementPaths(fixture);

  useEffect(() => {
    // Create empty fixture state
    if (!propsFs && elPaths.length === 0) {
      // Make sure not to override any (currently pending) fixture state props
      setPropsFs(prevFs => prevFs || []);
      return;
    }

    // Remove fixture state for removed child elements (likely via HMR)
    // FIXME: Also invalidate fixture state at this element path if the
    // component type of the corresponding element changed
    const fsProps = getFixtureStateProps(propsFs, decoratorId);
    fsProps.forEach(({ elementId }) => {
      if (elPaths.indexOf(elementId.elPath) === -1) {
        setPropsFs(prevFs => removeFixtureStateProps(prevFs, elementId));
      }
    });

    elPaths.forEach(elPath => {
      const childEl = getExpectedElementAtPath(fixture, elPath);
      const elementId = { decoratorId, elPath };
      // Component fixture state can be provided before the fixture mounts (eg.
      // a previous snapshot of a fixture state or the current fixture state
      // from another renderer)
      if (!findFixtureStateProps(propsFs, elementId)) {
        const componentName = getComponentName(childEl.type);
        setPropsFs(prevFs =>
          createFixtureStateProps({
            propsFs: prevFs,
            elementId,
            values: createValues(childEl.props),
            componentName,
          })
        );
      } else {
        const prevChildEl = getElementAtPath(prevFixtureRef.current, elPath);
        if (!areNodesEqual(prevChildEl, childEl, false)) {
          setPropsFs(prevFs =>
            updateFixtureStateProps({
              propsFs: prevFs,
              elementId,
              values: createValues(childEl.props),
            })
          );
        }
      }
    });
  }, [decoratorId, elPaths, fixture, propsFs, setPropsFs]);

  useEffect(() => {
    prevFixtureRef.current = fixture;
  });

  return useFixtureProps(fixture, propsFs, decoratorId);
}
