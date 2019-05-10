import * as React from 'react';
import styled from 'styled-components';
import { Notification, NotificationType } from './public';

type Props = {
  notifications: Notification[];
};

export function Notifications({ notifications }: Props) {
  return (
    <Container>
      {notifications.map(({ id, type, content }) => {
        const ItemType = ItemTypes[type];
        return <ItemType key={id}>{content}</ItemType>;
      })}
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 47px;
  right: 8px;
  z-index: 1;
`;

const Item = styled.div`
  width: 288px;
  margin: 2px 0 0 0;
  padding: 8px 16px 8px 12px;
  border-radius: 3px;
  line-height: 20px;
`;

const SuccessItem = styled(Item)`
  background: var(--success2);
  border-left: 4px solid var(--success1);
  color: #fff;
`;

const ErrorItem = styled(Item)`
  background: var(--error3);
  border-left: 4px solid var(--error2);
  color: #fff;
`;

const ItemTypes: { [key in NotificationType]: React.ComponentType } = {
  success: SuccessItem,
  error: ErrorItem
};
