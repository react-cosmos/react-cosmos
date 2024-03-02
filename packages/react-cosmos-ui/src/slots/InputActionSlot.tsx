import React from 'react';
import { InputsFixtureState } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';

export type InputActionSlotProps = {
  inputs: InputsFixtureState;
};

type Props = {
  slotProps: InputActionSlotProps;
  plugOrder: string[];
};

export function InputActionSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot name="inputAction" slotProps={slotProps} plugOrder={plugOrder} />
  );
}
