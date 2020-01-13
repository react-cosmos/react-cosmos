import { Message } from 'react-cosmos-shared2/util';
import { RendererPreviewContext } from './shared';
import { NotificationsSpec } from '../Notifications/public';

type State = {
  iframeRef: HTMLIFrameElement;
  onIframeLoad: (e: Event) => unknown;
};

const notificationId = 'renderer-location-change';

export function createRendererRequestHandler() {
  let state: null | State = null;

  function postRendererRequest(
    pluginContext: RendererPreviewContext,
    msg: Message
  ) {
    if (!state) return;

    const { iframeRef } = state;
    if (iframeRef.contentWindow) {
      const iframeWindow = iframeRef.contentWindow;
      if (
        msg.type === 'selectFixture' &&
        iframeLocationChanged(iframeWindow, iframeRef.src)
      ) {
        const notifications = getNotificationMethods(pluginContext);
        notifications.removeStickyNotification(notificationId);
        iframeWindow.location.replace(iframeRef.src);
      } else {
        iframeWindow.postMessage(msg, '*');
      }
    }
  }

  function setIframeRef(
    pluginContext: RendererPreviewContext,
    iframeRef: null | HTMLIFrameElement
  ) {
    if (state) state.iframeRef.removeEventListener('load', state.onIframeLoad);

    if (iframeRef) {
      state = {
        iframeRef,
        onIframeLoad(e: Event) {
          const iframe = e.target as HTMLIFrameElement;
          const iframeWindow = iframe.contentWindow;
          if (iframeWindow && iframeLocationChanged(iframeWindow, iframe.src)) {
            const notifications = getNotificationMethods(pluginContext);
            notifications.pushStickyNotification({
              id: notificationId,
              type: 'info',
              title: 'Renderer iframe location changed',
              info: `Reload or select another fixture to reset your preview.`
            });
          }
        }
      };
      iframeRef.addEventListener('load', state.onIframeLoad);
    } else {
      state = null;
    }
  }

  return { postRendererRequest, setIframeRef };
}

function iframeLocationChanged(iframeWindow: Window, iframeSrc: string) {
  try {
    const { href } = iframeWindow.location;
    const locationWithoutHash = href.split('#')[0];
    const locationCompareStart = locationWithoutHash.length - iframeSrc.length;
    return locationWithoutHash.substring(locationCompareStart) !== iframeSrc;
  } catch (err) {
    // An exception is thrown when trying to access the location of a
    // cross-origin frame, which signals that the iframe location host changed.
    return true;
  }
}

function getNotificationMethods(pluginContext: RendererPreviewContext) {
  return pluginContext.getMethodsOf<NotificationsSpec>('notifications');
}
