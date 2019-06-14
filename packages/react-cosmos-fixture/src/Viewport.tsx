import React from 'react';
import { FixtureContext } from './FixtureContext';

type Props = {
  children: React.ReactNode;
  width: number;
  height: number;
};

// This awkward declaration is required because of the cosmosCapture static
// property, which makes TS generate a declaration for Viewport that doesn't
// conform to React's component interface. Without this explicit type TS would
// allow clients to pass any props to Viewport.
export const Viewport: React.FC<Props> = function Viewport({
  children,
  width,
  height
}: Props) {
  const { setFixtureState } = React.useContext(FixtureContext);

  React.useEffect(() => {
    setFixtureState(fixtureState => ({
      ...fixtureState,
      viewport: { width, height }
    }));
  }, [setFixtureState, width, height]);

  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
  return <>{children}</>;
};

// @ts-ignore
Viewport.cosmosCapture = false;
