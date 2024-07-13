'use client';
import React from 'react';
import { ViewportFixtureState } from 'react-cosmos-core';
import { useFixtureState } from './useFixtureState.js';

type Props = {
  children: React.ReactNode;
  width: number;
  height: number;
};

export function Viewport({ children, width, height }: Props) {
  const [, setViewport] = useFixtureState<ViewportFixtureState>('viewport');

  React.useEffect(() => {
    setViewport({ width, height });
  }, [setViewport, width, height]);

  return children;
}

Viewport.cosmosCapture = false;
