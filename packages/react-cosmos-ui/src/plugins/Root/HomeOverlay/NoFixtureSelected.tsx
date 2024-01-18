import React from 'react';
import styled from 'styled-components';
import { BlankCanvasIllustration } from '../../../components/illustrations/BlankCanvas.js';
import { screenGrey3 } from '../../../style/colors.js';
import {
  IllustrationContainer,
  OverlayBody,
  OverlayContainer,
  SecondaryButton,
  TextContainer,
} from './ContentOverlay.js';
import { KeyShortcut } from './KeyShortcut.js';

type Props = {
  onShowWelcome: () => unknown;
};

export function NoFixtureSelected({ onShowWelcome }: Props) {
  return (
    <OverlayContainer data-testid="blank">
      <OverlayBody>
        <TextContainer>
          <KeyShortcut keys={['⌘', 'K']} label="Search fixtures" />
          <Subtitle>FIXTURE SELECTED</Subtitle>
          <KeyShortcut keys={['L']} label="Toggle fixture list" />
          <KeyShortcut keys={['P']} label="Toggle control panel" />
          <KeyShortcut keys={['E']} label="Edit fixture" />
          <KeyShortcut keys={['F']} label="Go full screen" />
          <KeyShortcut keys={['R']} label="Reload renderer" />
        </TextContainer>
        <IllustrationContainer>
          <BlankCanvasIllustration title="blank state" />
        </IllustrationContainer>
      </OverlayBody>
      <ShowWelcomeButton onClick={onShowWelcome}>
        show welcome screen
      </ShowWelcomeButton>
    </OverlayContainer>
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
