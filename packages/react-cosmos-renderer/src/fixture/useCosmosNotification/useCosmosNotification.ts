import { useContext } from 'react';
import { NotificationType } from 'react-cosmos-core';
import { RendererContext } from '../../rendererConnect/RendererContext.js';

type NotificationInput = {
  id: string;
  type: NotificationType;
  title: string;
  info: string;
};

type UseCosmosNotificationReturn = {
  pushStickyNotification(notification: NotificationInput): void;
  removeStickyNotification(notificationId: string): void;
  pushTimedNotification(notification: NotificationInput): void;
};

export function useCosmosNotification(): UseCosmosNotificationReturn {
  const rendererContext = useContext(RendererContext);
  const { rendererId, rendererConnect, selectedFixture } = rendererContext;

  if (!selectedFixture) {
    throw new Error(
      'useCosmosNotification can only be used inside a Cosmos fixture'
    );
  }

  const { fixtureId } = selectedFixture;

  const pushStickyNotification = (notification: NotificationInput) => {
    rendererConnect.postMessage({
      type: 'pushStickyNotification',
      payload: {
        rendererId,
        fixtureId,
        notification,
      },
    });
  };

  const removeStickyNotification = (notificationId: string) => {
    rendererConnect.postMessage({
      type: 'removeStickyNotification',
      payload: {
        rendererId,
        fixtureId,
        notificationId,
      },
    });
  };

  const pushTimedNotification = (notification: NotificationInput) => {
    rendererConnect.postMessage({
      type: 'pushTimedNotification',
      payload: {
        rendererId,
        fixtureId,
        notification,
      },
    });
  };

  return {
    pushStickyNotification,
    removeStickyNotification,
    pushTimedNotification,
  };
}