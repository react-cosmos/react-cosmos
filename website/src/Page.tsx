import React from 'react';
import styled from 'styled-components';
import { Footer } from './Footer';
import { MinimizedHeader } from './Header/MinimizedHeader';
import {
  Center,
  grayToWhiteGradient,
  headerBackdropFilter,
  headerBg,
  headerBorderBottom
} from './shared/ui';

type Props = {
  children: React.ReactNode;
};

export function Page({ children }: Props) {
  return (
    <>
      <SimpleHeader>
        <MinimizedHeader visible={true} />
      </SimpleHeader>
      <Gradient1>
        <Center>{children}</Center>
      </Gradient1>
      <Footer />
    </>
  );
}

const SimpleHeader = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${headerBg};
  border-bottom: ${headerBorderBottom};
  backdrop-filter: ${headerBackdropFilter};
`;

const Gradient1 = styled.div`
  padding: 20vh 0;
  background: ${grayToWhiteGradient};
`;
