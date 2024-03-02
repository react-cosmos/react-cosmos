import React from 'react';
import {
  FixtureStateUpdater,
  InputFixtureState,
  InputsFixtureState,
} from 'react-cosmos-core';
import { Slot } from 'react-plugin';

export type InputSlotProps<TInput extends InputFixtureState> = {
  inputName: string;
  input: TInput;
  onFixtureStateChange: (
    updater: FixtureStateUpdater<InputsFixtureState>
  ) => void;
};

type Props = {
  slotProps: InputSlotProps<any>;
};

export function InputSlot({ slotProps }: Props) {
  return <Slot name={`input-${slotProps.input.type}`} slotProps={slotProps} />;
}
