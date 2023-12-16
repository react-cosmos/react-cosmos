import { isEqual } from 'lodash-es';
import React, { useCallback } from 'react';
import {
  FixtureStateValues,
  PropsFixtureStateItem,
  resetPropsFixtureStateItem,
  updatePropsFixtureStateItem,
} from 'react-cosmos-core';
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
  ValueInputTree,
  stringifyElementId,
} from '../../../components/ValueInputTree/index.js';
import { IconButton32 } from '../../../components/buttons/index.js';
import { CopyIcon, RotateCcwIcon } from '../../../components/icons/index.js';
import { TreeExpansion } from '../../../shared/treeExpansion.js';
import { SetFixtureStateProps } from '../shared.js';
import { propsFsItemUpdater } from './shared.js';

type Props = {
  propsFsItem: PropsFixtureStateItem;
  fixtureExpansion: FixtureExpansion;
  onFixtureStateChange: SetFixtureStateProps;
  onElementExpansionChange: OnElementExpansionChange;
};

export function ComponentProps({
  propsFsItem,
  fixtureExpansion,
  onFixtureStateChange,
  onElementExpansionChange,
}: Props) {
  const { componentName, elementId, values } = propsFsItem;

  const [reset, setReset] = React.useState(true);
  const handleResetToggle = React.useCallback(() => setReset(!reset), [reset]);

  const [initialValues] = React.useState(() => values);
  const handleValuesReset = React.useCallback(
    () =>
      onFixtureStateChange(
        propsFsItemUpdater(elementId, prevFs =>
          resetPropsFixtureStateItem({
            propsFs: prevFs,
            elementId,
            values: initialValues,
          })
        )
      ),
    [elementId, initialValues, onFixtureStateChange]
  );

  const handleValueChange = React.useCallback(
    (newValues: FixtureStateValues) => {
      const changeFn = reset
        ? resetPropsFixtureStateItem
        : updatePropsFixtureStateItem;
      onFixtureStateChange(
        propsFsItemUpdater(elementId, prevFs =>
          changeFn({
            propsFs: prevFs,
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
