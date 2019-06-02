import React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { usePropsCapture } from './props';
import { useClassStateCapture } from './classState';

export type Props = {
  children: React.ReactNode;
  decoratorId: FixtureDecoratorId;
};

export function FixtureCapture({ children, decoratorId }: Props) {
  let fixture = usePropsCapture(children, decoratorId);
  fixture = useClassStateCapture(fixture, decoratorId);

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
  return <>{fixture}</>;
}
