// @flow

import React from 'react';
import styled from 'styled-components';
import { Slot } from 'react-plugin';
import { XCircleIcon, RefreshCwIcon, MaximizeIcon } from '../../shared/icons';
import { Button } from '../../shared/components';

import type { UrlParams } from '../Router';

export type { CoreConfig } from '../../index.js.flow';

type Props = {
  urlParams: UrlParams,
  setUrlParams: UrlParams => void
};

// TODO: Improve UX of refresh button, which seems like it's not doing anything
export function FixtureActions({ urlParams, setUrlParams }: Props) {
  const { fixturePath, fullScreen } = urlParams;

  if (fullScreen) {
    return null;
  }

  if (!fixturePath) {
    return (
      <Container>
        <Left>
          <BlankMessage>No fixture selected</BlankMessage>
        </Left>
        <Right>
          <Slot name="fixtureActions" />
          <Button disabled icon={<MaximizeIcon />} label="fullscreen" />
        </Right>
      </Container>
    );
  }

  return (
    <Container>
      <Left>
        <Button
          icon={<XCircleIcon />}
          label="close"
          onClick={() => setUrlParams({})}
        />
        <Button
          icon={<RefreshCwIcon />}
          label="refresh"
          onClick={() => setUrlParams({ fixturePath })}
        />
      </Left>
      <Right>
        <Slot name="fixtureActions" />
        <Button
          icon={<MaximizeIcon />}
          label="fullscreen"
          onClick={() => setUrlParams({ fixturePath, fullScreen: true })}
        />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--grey5);
  white-space: nowrap;
  overflow-x: auto;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BlankMessage = styled.span`
  margin-left: 4px;
  color: var(--grey3);
`;
