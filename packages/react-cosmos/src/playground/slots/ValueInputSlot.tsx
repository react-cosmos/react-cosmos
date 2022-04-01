import React, { ReactNode } from 'react';
import { Slot } from 'react-plugin';
import {
  FixtureStatePrimitiveValue,
  FixtureStateUnserializableValue,
  PrimitiveData,
} from '../../core/fixtureState/types.js';

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
