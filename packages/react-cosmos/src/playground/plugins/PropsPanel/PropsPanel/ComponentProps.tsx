import { isEqual } from 'lodash';
import React, { useCallback } from 'react';
import {
  resetFixtureStateProps,
  updateFixtureStateProps,
} from 'react-cosmos-core/fixtureState';
import {
  FixtureState,
  FixtureStateProps,
  FixtureStateValues,
} from 'react-cosmos-core/fixtureState';
import { StateUpdater } from 'react-cosmos-core/utils';
import { IconButton32 } from '../../../components/buttons/index.js';
import { CopyIcon, RotateCcwIcon } from '../../../components/icons/index.js';
import {
  SidePanelActions,
  SidePanelBody,
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../../components/SidePanel.js';
import { ExpandCollapseValues } from '../../../components/ValueInputTree/ExpandCollapseValues.js';
import {
  FixtureExpansion,
  OnElementExpansionChange,
  stringifyElementId,
  ValueInputTree,
} from '../../../components/ValueInputTree/index.js';
import { TreeExpansion } from '../../../shared/treeExpansion.js';
import { createPropsFsUpdater } from './shared.js';

type Props = {
  fsProps: FixtureStateProps;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
  onElementExpansionChange: OnElementExpansionChange;
};

export function ComponentProps({
  fsProps,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  const { componentName, elementId, values } = fsProps;

  const [reset, setReset] = React.useState(true);
  const handleResetToggle = React.useCallback(() => setReset(!reset), [reset]);

  const [initialValues] = React.useState(() => values);
  const handleValuesReset = React.useCallback(
    () =>
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          resetFixtureStateProps({
            fixtureState: prevFs,
            elementId,
            values: initialValues,
          })
        )
      ),
    [elementId, initialValues, onFixtureStateChange]
  );

  const handleValueChange = React.useCallback(
    (newValues: FixtureStateValues) => {
      const changeFn = reset ? resetFixtureStateProps : updateFixtureStateProps;
      onFixtureStateChange(
        createPropsFsUpdater(elementId, prevFs =>
          changeFn({
            fixtureState: prevFs,
            elementId,
            values: newValues,
          })
        )
      );
    },
    [elementId, reset, onFixtureStateChange]
  );

  const strElementId = stringifyElementId(elementId);
  const expansion = fixtureExpansion[strElementId] || {};
  const setExpansion = useCallback(
    (newExpansion: TreeExpansion) =>
      onElementExpansionChange(elementId, newExpansion),
    [elementId, onElementExpansionChange]
  );

  return (
    <SidePanelContainer>
      <SidePanelHeader>
        <SidePanelTitle label="Props" componentName={componentName} />
        <SidePanelActions>
          <IconButton32
            title="Reset to initial values"
            icon={<RotateCcwIcon />}
            disabled={isEqual(values, initialValues)}
            onClick={handleValuesReset}
          />
          <IconButton32
            title="Reuse instances on prop changes"
            icon={<CopyIcon />}
            selected={!reset}
            disabled={false}
            onClick={handleResetToggle}
          />
          <ExpandCollapseValues
            values={values}
            expansion={expansion}
            setExpansion={setExpansion}
          />
        </SidePanelActions>
      </SidePanelHeader>
      <SidePanelBody>
        <ValueInputTree
          id={strElementId}
          values={values}
          expansion={expansion}
          setExpansion={setExpansion}
          onValueChange={handleValueChange}
        />
      </SidePanelBody>
    </SidePanelContainer>
  );
}
