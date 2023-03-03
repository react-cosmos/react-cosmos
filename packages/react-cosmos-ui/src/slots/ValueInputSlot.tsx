import React, { ReactNode } from 'react';
import {
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue,
  PrimitiveData,
} from 'react-cosmos-core';
import { Slot } from 'react-plugin';

type LeafValue = FixtureStatePrimitiveValue | FixtureStateUnserializableValue;

export type ValueInputSlotProps = {
  id: string;
  name: string;
  value: LeafValue;
  indentLevel: number;
  onChange: (data: PrimitiveData) => unknown;
};

type Props = {
  children: ReactNode;
  slotProps: ValueInputSlotProps;
};

export function ValueInputSlot({ children, slotProps }: Props) {
  return (
    <Slot name="valueInput" slotProps={slotProps}>
      {children}
    </Slot>
  );
}
