// @flow

import React from 'react';
import styled from 'styled-components';
import { Slot } from 'react-plugin';
import { XCircleIcon, RefreshCwIcon, MaximizeIcon } from '../../shared/icons';
import { Button } from '../../shared/components';

import type { UrlParams } from '../Router';

type Props = {
  urlParams: UrlParams,
  setUrlParams: UrlParams => void,
  isFixturePathValid: (fixturePath: string) => boolean
};

// TODO: Improve UX of refresh button, which seems like it's not doing anything
export function FixtureHeader({
  urlParams,
  setUrlParams,
  isFixturePathValid
}: Props) {
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

  if (!isFixturePathValid(fixturePath)) {
    return (
      <Container>
        <Left>
          <BlankMessage>Fixture not found</BlankMessage>
          <Button
            icon={<XCircleIcon />}
            label="close"
            onClick={() => setUrlParams({})}
          />
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
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid var(--grey5);
  white-space: nowrap;
  overflow-x: auto;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BlankMessage = styled.span`
  margin: 0 4px;
  color: var(--grey3);
`;
