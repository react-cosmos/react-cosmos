import { isEqual } from 'lodash-es';
import React from 'react';
import { InputFixtureState, InputsFixtureState } from 'react-cosmos-core';
import {
  SidePanelActions,
  SidePanelBody,
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../components/SidePanel.js';
import { IconButton32 } from '../../components/buttons/index.js';
import { RotateCcwIcon } from '../../components/icons/index.js';
import { InputActionSlot } from '../../slots/InputActionSlot.js';
import { InputSlot } from '../../slots/InputSlot.js';
import { SetInputsFixtureState } from './shared.js';

type Props = {
  fixtureState: InputsFixtureState | undefined;
  inputActionOrder: string[];
  onFixtureStateChange: SetInputsFixtureState;
};

export function InputsPanel({
  fixtureState,
  inputActionOrder,
  onFixtureStateChange,
}: Props) {
  const handleInputsReset = React.useCallback(
    () => onFixtureStateChange(resetInputs),
    [onFixtureStateChange]
  );

  const inputs = fixtureState ?? {};
  if (Object.keys(inputs).length === 0) return null;

  return (
    <SidePanelContainer>
      <SidePanelHeader>
        <SidePanelTitle label="Inputs" />
        <SidePanelActions>
          <IconButton32
            title="Reset to default values"
            icon={<RotateCcwIcon />}
            disabled={areInputsUnchanged(inputs)}
            onClick={handleInputsReset}
          />
          <InputActionSlot
            slotProps={{ inputs }}
            plugOrder={inputActionOrder}
          />
        </SidePanelActions>
      </SidePanelHeader>
      <SidePanelBody>
        {Object.keys(inputs).map(inputName => (
          <InputSlot
            key={inputName}
            slotProps={{
              inputName,
              input: inputs[inputName],
              onFixtureStateChange,
            }}
          />
        ))}
      </SidePanelBody>
    </SidePanelContainer>
  );
}

function areInputsUnchanged(inputs: InputsFixtureState) {
  return Object.keys(inputs).every(inputName =>
    isEqual(inputs[inputName].currentValue, inputs[inputName].defaultValue)
  );
}

function resetInputs(fixtureState: InputsFixtureState | undefined) {
  const inputs = fixtureState ? { ...fixtureState } : {};
  Object.keys(inputs).forEach(inputName => {
    inputs[inputName] = resetInput(inputs[inputName]);
  });
  return inputs;
}

function resetInput<TInput extends InputFixtureState>(input: TInput) {
  return { ...input, currentValue: input.defaultValue };
}
