import React from 'react';
import styled from 'styled-components';
import { SlidersIcon } from '../../shared/icons';
import { grey160, grey224, grey32, grey64 } from '../../shared/ui/colors';

export function BlankState() {
  return (
    <Container>
      <IconContainer>
        <SlidersIcon />
      </IconContainer>
      <Title>
        No visible props in <NoWrap>selected fixture</NoWrap>
      </Title>
      <Description>
        Props of exported JSX <NoWrap>elements from</NoWrap> your fixtures{' '}
        <NoWrap>will appear here.</NoWrap>
      </Description>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px 24px;
  background: ${grey32};
  font-size: 14px;
  line-height: 22px;
`;

export const IconContainer = styled.div`
  --size: 32px;

  margin: 16px auto;
  display: flex;
  width: var(--size);
  height: var(--size);
  color: ${grey64};
`;

const Title = styled.div`
  margin: 0 0 16px 0;
  color: ${grey224};
  text-align: center;
  font-weight: 500;
`;

const Description = styled.div`
  margin: 0 auto;
  max-width: 256px;
  color: ${grey160};
  text-align: center;
`;

export const NoWrap = styled.span`
  white-space: nowrap;
`;
