import * as React from 'react';
import { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';
import { useCaptureProps } from './props';
import { useCaptureClassState } from './classState';

export type Props = {
  children: React.ReactNode;
  decoratorId: FixtureDecoratorId;
};

export function FixtureCapture({ children, decoratorId }: Props) {
  let fixture = useCaptureProps(children, decoratorId);
  fixture = useCaptureClassState(fixture, decoratorId);

  // TODO: Explain <>
  return <>{fixture}</>;
}
