import React from 'react';
import styled from 'styled-components';
import { ArtificialIntelligenceIllustration } from '../../components/illustrations/ArtificialIntelligence.js';
import {
  screenGrey3,
  screenGrey5,
  screenPrimary2,
  screenPrimary3,
} from '../../style/colors.js';
import {
  ContentContainer,
  IllustrationContainer,
  NoWrap,
  TextContainer,
} from './shared.js';

// webpack???
export function RendererNotResponding() {
  return (
    <ContentContainer>
      <TextContainer>
        <Header>
          Renderer <NoWrap>not responding</NoWrap>
        </Header>
        <Paragraph>{`It's usually one of the following...`}</Paragraph>
        <List>
          <li>
            <No>1</No>
            <span>
              <strong>Please check your terminal for errors.</strong>
              <br />
              Your build might be broken.
            </span>
          </li>
          <li>
            <No>2</No>
            <span>
              If you use a custom webpack config,{' '}
              <strong>
                make sure
                <br />
                your build is generating an index.html page.
              </strong>
            </span>
          </li>
        </List>
        <Paragraph>
          <ActionLink
            href="https://react-cosmos.slack.com/join/shared_invite/zt-g9rsalqq-clCoV7DWttVvzO5FAAmVAw"
            rel="noopener noreferrer"
            target="_blank"
          >
            ask for help
          </ActionLink>
        </Paragraph>
      </TextContainer>
      <IllustrationContainer>
        <ArtificialIntelligenceIllustration title="robot" />
      </IllustrationContainer>
    </ContentContainer>
  );
}

const Header = styled.h1`
  position: relative;
  margin: 0 0 64px 0;
  color: ${screenPrimary2};
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.015em;

  ::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 64px;
    height: 3px;
    background: ${screenPrimary2};
  }
`;

const Paragraph = styled.p`
  margin: 16px 0;

  :last-child {
    margin-bottom: 0;
  }
`;

const List = styled.ul`
  margin: 0 0 48px 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 12px;
  }
`;

const No = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  width: 32px;
  height: 32px;
  margin: 6px 16px 0 0;
  padding: 0 6px 0 0;
  border-radius: 100%;
  font-size: 18px;
  font-weight: 600;
  background: ${screenGrey5};
  color: ${screenGrey3};

  ::after {
    content: '.';
  }
`;

const actionLinkHeight = 36;

const ActionLink = styled.a`
  display: inline-block;
  height: ${actionLinkHeight}px;
  padding: 0 16px;
  background: ${screenPrimary3};
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
  line-height: ${actionLinkHeight}px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
`;
