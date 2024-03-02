import React from 'react';
import {
  FixtureStateUpdater,
  InputFixtureState,
  InputsFixtureState,
} from 'react-cosmos-core';
import { Slot } from 'react-plugin';

export type InputSlotProps<T extends InputFixtureState> = {
  inputName: string;
  input: T;
  onFixtureStateChange: (
    updater: FixtureStateUpdater<InputsFixtureState>
  ) => void;
};

type Props<T extends InputFixtureState> = {
  slotProps: InputSlotProps<T>;
};

export function InputSlot<T extends InputFixtureState>({
  slotProps,
}: Props<T>) {
  return <Slot name={`input-${slotProps.input.type}`} slotProps={slotProps} />;
}
