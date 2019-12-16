import React from 'react';
import styled from 'styled-components';
import { Footer } from './Footer/Footer';
import { grayToWhiteGradient } from './shared/ui';
import { StickyHeader } from './StickyHeader/StickyHeader';

type Props = {
  children: React.ReactNode;
};

export function Page({ children }: Props) {
  return (
    <Container>
      <StickyHeader />
      <Gradient1>{children}</Gradient1>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background: #d6dde2;
`;

const Gradient1 = styled.div`
  background: ${grayToWhiteGradient};
`;
