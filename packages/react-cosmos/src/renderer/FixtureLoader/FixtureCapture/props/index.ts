import React from 'react';
import { createValues } from '../../../../core/fixtureState/createValues.js';
import {
  createFixtureStateProps,
  findFixtureStateProps,
  getFixtureStateProps,
  removeFixtureStateProps,
  updateFixtureStateProps,
} from '../../../../core/fixtureState/props.js';
import { FixtureDecoratorId } from '../../../../core/fixtureState/types.js';
import { areNodesEqual } from '../../../../utils/react/areNodesEqual.js';
import { getComponentName } from '../../../../utils/react/getComponentName.js';
import { FixtureContext } from '../../../FixtureContext.js';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths.js';
import {
  getElementAtPath,
  getExpectedElementAtPath,
} from '../shared/nodeTree/index.js';
import { useFixtureProps } from './useFixtureProps.js';

export function usePropsCapture(
  fixture: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);
  const prevFixtureRef = React.useRef(fixture);
  const elPaths = findRelevantElementPaths(fixture);

  React.useEffect(() => {
    // Create empty fixture state
    if (!fixtureState.props && elPaths.length === 0) {
      // Make sure not to override any (currently pending) fixture state props
      setFixtureState(prevFs => ({ ...prevFs, props: prevFs.props || [] }));
      return;
    }

    // Remove fixture state for removed child elements (likely via HMR)
    // FIXME: Also invalidate fixture state at this element path if the
    // component type of the corresponding element changed
    const fsProps = getFixtureStateProps(fixtureState, decoratorId);
    fsProps.forEach(({ elementId }) => {
      if (elPaths.indexOf(elementId.elPath) === -1) {
        setFixtureState(prevFs => ({
          ...prevFs,
          props: removeFixtureStateProps(fixtureState, elementId),
        }));
      }
    });

    elPaths.forEach(elPath => {
      const childEl = getExpectedElementAtPath(fixture, elPath);
      const elementId = { decoratorId, elPath };
      // Component fixture state can be provided before the fixture mounts (eg.
      // a previous snapshot of a fixture state or the current fixture state
      // from another renderer)
      if (!findFixtureStateProps(fixtureState, elementId)) {
        const componentName = getComponentName(childEl.type);
        setFixtureState(prevFs => ({
          ...prevFs,
          props: createFixtureStateProps({
            fixtureState: prevFs,
            elementId,
            values: createValues(childEl.props),
            componentName,
          }),
        }));
      } else {
        const prevChildEl = getElementAtPath(prevFixtureRef.current, elPath);
        if (!areNodesEqual(prevChildEl, childEl, false)) {
          setFixtureState(prevFs => ({
            ...prevFs,
            props: updateFixtureStateProps({
              fixtureState,
              elementId,
              values: createValues(childEl.props),
            }),
          }));
        }
      }
    });
  }, [
    fixture,
    decoratorId,
    elPaths,
    fixtureState,
    fixtureState.props,
    setFixtureState,
  ]);

  React.useEffect(() => {
    prevFixtureRef.current = fixture;
  });

  return useFixtureProps(fixture, fixtureState, decoratorId);
}
