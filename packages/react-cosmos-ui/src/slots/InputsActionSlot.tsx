import React from 'react';
import { InputsFixtureState } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';

export type InputsActionSlotProps = {
  inputs: InputsFixtureState;
};

type Props = {
  slotProps: InputsActionSlotProps;
  plugOrder: string[];
};

export function InputsActionSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot
      name="inputsAction"
      slotProps={slotProps}
      plugOrder={plugOrder}
    />
  );
}
