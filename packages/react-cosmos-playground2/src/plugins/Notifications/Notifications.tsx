import React from 'react';
import styled from 'styled-components';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
  LoaderIcon
} from '../../shared/icons';
import {
  grey128,
  grey64,
  grey32,
  grey8,
  white95
} from '../../shared/ui/colors';
import { Notification, NotificationType } from './public';

type Props = {
  notifications: Notification[];
};

export function Notifications({ notifications }: Props) {
  return (
    <Container>
      {notifications.map(({ id, type, title, info }) => {
        const Icon = IconTypes[type];
        return (
          <Item key={id}>
            <IconContainer>
              <Icon />
            </IconContainer>
            <Content>
              <Title>{title}</Title>
              <Info>{info}</Info>
            </Content>
          </Item>
        );
      })}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 56px;
  margin-top: 6px;
  border-radius: 6px;
  background: ${white95};
  box-shadow: 0 2px 10px -4px ${grey8};
  line-height: 20px;
  animation: fadeScaleIn var(--quick) forwards;

  :first-child {
    margin-top: 0;
  }

  @keyframes fadeScaleIn {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const IconContainer = styled.div`
  --size: 20px;
  width: var(--size);
  height: var(--size);
  margin: 18px 16px;
  color: ${grey128};
`;

const Content = styled.div`
  width: 288px;
  padding: 8px 16px 8px 0;
`;

const Title = styled.div`
  color: ${grey32};
  font-weight: 500;
`;

const Info = styled.div`
  margin: 2px 0 0 0;
  font-size: 12px;
  line-height: 18px;
  color: ${grey64};
`;

const IconTypes: { [key in NotificationType]: React.ComponentType } = {
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  info: InfoIcon,
  loading: LoaderIcon
};
