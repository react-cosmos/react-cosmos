'use client';
import React from 'react';
import { useFixtureState } from './useFixtureState.js';

type Viewport = {
  width: number;
  height: number;
};

type Props = {
  children: React.ReactNode;
  width: number;
  height: number;
};

export function Viewport({ children, width, height }: Props) {
  const [, setViewport] = useFixtureState<Viewport>('viewport');

  React.useEffect(() => {
    setViewport({ width, height });
  }, [setViewport, width, height]);

  return children;
}

Viewport.cosmosCapture = false;
