import React from 'react';
import styled from 'styled-components';
import { BlankCanvasIllustration } from '../../shared/illustrations';
import {
  ContentContainer,
  IllustrationContainer,
  SecondaryButton
} from './shared';

type Props = {
  onShowWelcome: () => unknown;
};

export function NoFixtureSelected({ onShowWelcome }: Props) {
  return (
    <>
      <ContentContainer>
        <IllustrationContainer>
          <BlankCanvasIllustration title="blank state" />
        </IllustrationContainer>
      </ContentContainer>
      <ShowWelcomeButton onClick={onShowWelcome}>
        show welcome screen
      </ShowWelcomeButton>
    </>
  );
}

const ShowWelcomeButton = styled(SecondaryButton)`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;
