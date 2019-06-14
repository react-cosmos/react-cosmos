import React from 'react';
import styled from 'styled-components';
import { EmptyIllustration } from '../../../shared/illustrations';

export function BlankState() {
  return (
    <Container>
      <IllustrationContainer>
        <EmptyIllustration title="empty props panel" />
      </IllustrationContainer>
      <Title>No visible props in selected fixture</Title>
      <Description>
        Props of exported JSX elements from your fixtures will appear here.
      </Description>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px 24px;
  background: var(--grey2);
  font-size: 14px;
  line-height: 22px;
`;

export const IllustrationContainer = styled.div`
  --size: 128px;

  margin: 0 auto;
  display: flex;
  width: var(--size);
  height: var(--size);
  mix-blend-mode: luminosity;
`;

const Title = styled.div`
  margin: 4px 0;
  color: var(--grey6);
`;

const Description = styled.div`
  color: var(--grey4);
  font-size: 13px;
  line-height: 20px;
`;
