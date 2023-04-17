import React from 'react';
import { FixtureDecoratorId } from '../../fixtureState/types.js';
import { useClassStateCapture } from './classState/index.js';
import { usePropsCapture } from './props/index.js';

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
