import React from 'react';
import styled from 'styled-components';
import { FileIcon } from '../../shared/icons';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
};

export function BlankState({ fixturesDir, fixtureFileSuffix }: Props) {
  return (
    <Container>
      <IconContainer>
        <FileIcon />
      </IconContainer>
      <Title>
        No component <NoWrap>fixtures found</NoWrap>
      </Title>
      <Description>
        <ol>
          <li>
            Place fixture files under <code>{fixturesDir}</code> dirs or add the{' '}
            <code>.{fixtureFileSuffix}</code> suffix in{' '}
            <NoWrap>their name</NoWrap>
          </li>
          <li>
            Default exports from your fixtures (any React element or component){' '}
            will <NoWrap>appear here</NoWrap>
          </li>
        </ol>
      </Description>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px 24px;
  background: var(--grey1);
  font-size: 14px;
  line-height: 22px;
`;

export const IconContainer = styled.div`
  --size: 32px;

  margin: 8px auto 16px auto;
  display: flex;
  width: var(--size);
  height: var(--size);
  color: var(--grey2);
`;

const Title = styled.div`
  margin: 0 0 16px 0;
  color: var(--grey5);
  text-align: center;
`;

const Description = styled.div`
  margin: 0 auto;
  max-width: 232px;
  color: var(--grey4);
  font-size: 13px;
  line-height: 20px;
  text-align: left;

  ol {
    margin: 8px 0;
    padding: 0 0 0 16px;
  }

  li {
    margin-bottom: 8px;
  }

  code {
    padding: 0 4px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.2);
    color: var(--grey5);
    font-family: 'Dank Mono', Courier, monospace;
  }
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
