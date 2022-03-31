import React from 'react';
import styled from 'styled-components';
import { screenGrey3 } from '../../../ui/colors';
import { BlankCanvasIllustration } from '../../shared/illustrations';
import { KeyShortcut } from './KeyShortcut';
import {
  ContentContainer,
  IllustrationContainer,
  SecondaryButton,
  TextContainer,
} from './shared';

type Props = {
  onShowWelcome: () => unknown;
};

export function NoFixtureSelected({ onShowWelcome }: Props) {
  return (
    <>
      <ContentContainer>
        <TextContainer>
          <KeyShortcut keys={['⌘', 'P']} label="Search fixtures" />
          <Subtitle>FIXTURE SELECTED</Subtitle>
          <KeyShortcut keys={['⌘', '⇧', 'L']} label="Toggle fixture list" />
          <KeyShortcut keys={['⌘', '⇧', 'K']} label="Toggle control panel" />
          <KeyShortcut keys={['⌘', '⇧', 'E']} label="Edit fixture" />
          <KeyShortcut keys={['⌘', '⇧', 'F']} label="Go full screen" />
        </TextContainer>
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

const Subtitle = styled.div`
  margin: 40px 0 24px 0;
  color: ${screenGrey3};
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.5px;
`;

const ShowWelcomeButton = styled(SecondaryButton)`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;
