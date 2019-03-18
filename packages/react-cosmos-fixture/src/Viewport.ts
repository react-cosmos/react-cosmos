import * as React from 'react';
import { FixtureContext } from './FixtureContext';

type Props = {
  children: React.ReactNode;
  width: number;
  height: number;
};

export function Viewport({ children, width, height }: Props) {
  const { setFixtureState } = React.useContext(FixtureContext);

  React.useEffect(() => {
    setFixtureState(fixtureState => ({
      ...fixtureState,
      viewport: { width, height }
    }));
  }, [setFixtureState, width, height]);

  return children;
}
