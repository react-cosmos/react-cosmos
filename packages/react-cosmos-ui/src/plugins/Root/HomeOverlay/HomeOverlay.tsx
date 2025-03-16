import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { StyledIcon, StyledLink } from '../../../components/buttons/shared.js';
import {
  HelpCircleIcon,
  MessageSquareIcon,
} from '../../../components/icons/index.js';
import { grey128, grey24, grey32, grey8 } from '../../../style/colors.js';

export function HomeOverlay() {
  return (
    <Container>
      <Footer>
        <FooterLink
          href="https://github.com/react-cosmos/react-cosmos/releases"
          label={`v${VERSION}`}
          title="Releases"
        />
        <FooterLink
          icon={<HelpCircleIcon />}
          href="https://reactcosmos.org/docs/user-interface"
          title="Documentation"
        />
        <FooterLink
          icon={<MessageSquareIcon />}
          href="https://discord.gg/3X95VgfnW5"
          title="Discord"
        />
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${grey8};
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  height: 40px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

function FooterLink(props: {
  href: string;
  icon?: ReactNode;
  label?: string;
  title: string;
}) {
  const { href, icon, label, title } = props;
  return (
    <StyledLink
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      bg={grey8}
      bgSelect={grey32}
      bgHover={grey24}
      color={grey128}
      colorSelect={grey128}
      title={title}
      selected={false}
      disabled={false}
    >
      {icon ? <StyledIcon color={grey128}>{icon}</StyledIcon> : label}
    </StyledLink>
  );
}
