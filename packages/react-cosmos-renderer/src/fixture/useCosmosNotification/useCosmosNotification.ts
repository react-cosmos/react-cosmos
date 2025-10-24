import { useContext, useMemo } from 'react';
import { NotificationItem, TimedNotificationItem } from 'react-cosmos-core';
import { RendererContext } from '../../rendererConnect/RendererContext.js';

type UseCosmosNotificationReturn = {
  pushSticky(notification: NotificationItem): void;
  removeSticky(notificationId: string): void;
  pushTimed(notification: TimedNotificationItem): void;
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
  const { postMessage } = rendererConnect;

  return useMemo(
    () => ({
      pushSticky: (notification: NotificationItem) => {
        postMessage({
          type: 'pushStickyNotification',
          payload: {
            rendererId,
            fixtureId,
            notification,
          },
        });
      },
      removeSticky: (notificationId: string) => {
        postMessage({
          type: 'removeStickyNotification',
          payload: {
            rendererId,
            fixtureId,
            notificationId,
          },
        });
      },
      pushTimed: (notification: TimedNotificationItem) => {
        postMessage({
          type: 'pushTimedNotification',
          payload: {
            rendererId,
            fixtureId,
            notification,
          },
        });
      },
    }),
    [fixtureId, postMessage, rendererId]
  );
}
