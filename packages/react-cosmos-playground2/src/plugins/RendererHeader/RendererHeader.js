// @flow

import React from 'react';
import styled from 'styled-components';
import { Slot } from 'react-plugin';
import {
  XCircleIcon,
  RefreshCwIcon,
  MaximizeIcon,
  HomeIcon
} from '../../shared/icons';
import { Button } from '../../shared/components';
import { HelpLink } from './HelpLink';

import type { UrlParams } from '../Router';
import type { RendererStatus } from '../RendererPreview';

type Props = {
  urlParams: UrlParams,
  rendererStatus: RendererStatus,
  setUrlParams: UrlParams => void,
  isValidFixturePath: (fixturePath: string) => boolean
};

// TODO: Improve UX of refresh button, which seems like it's not doing anything
export function RendererHeader({
  urlParams,
  rendererStatus,
  setUrlParams,
  isValidFixturePath
}: Props) {
  const { fixturePath, fullScreen } = urlParams;

  if (rendererStatus === 'notResponding') {
    return (
      <Container error>
        <Left>
          <Message>
            <strong>Renderer not responding</strong>. Check your terminal for
            errors...
          </Message>
        </Left>
        <Right>
          <HelpLink />
        </Right>
      </Container>
    );
  }

  if (fullScreen) {
    return null;
  }

  if (rendererStatus === 'waiting') {
    return (
      <Container>
        <Left>
          <Message>Waiting for renderer...</Message>
        </Left>
      </Container>
    );
  }

  if (!fixturePath) {
    return (
      <Container>
        <Left>
          <Message>No fixture selected</Message>
        </Left>
        <Right>
          <Slot name="fixtureActions" />
          <Button disabled icon={<MaximizeIcon />} label="fullscreen" />
        </Right>
      </Container>
    );
  }

  if (!isValidFixturePath(fixturePath)) {
    return (
      <Container>
        <Left>
          <Message>Fixture not found</Message>
          <Button
            icon={<HomeIcon />}
            label="home"
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
  border-bottom: 1px solid
    ${props => (props.error ? 'var(--error5)' : 'var(--grey5)')};
  background: ${props => (props.error ? 'var(--error6)' : 'var(--grey6)')};
  color: ${props => (props.error ? 'var(--error3)' : 'var(--grey3)')};
  white-space: nowrap;
  overflow-x: auto;
  transition: background var(--quick), color var(--quick), border var(--quick);
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

const Message = styled.span`
  margin: 0 4px;

  strong {
    font-weight: 600;
  }
`;
