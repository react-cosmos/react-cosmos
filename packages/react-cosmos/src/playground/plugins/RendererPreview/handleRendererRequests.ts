import { MessageType } from 'react-cosmos-core/utils';
import { NotificationsSpec } from '../Notifications/spec.js';
import { RendererPreviewContext } from './shared.js';

type State = {
  iframeRef: HTMLIFrameElement;
  onIframeLoad: (e: Event) => unknown;
};

const notificationId = 'renderer-location-change';

export function createRendererRequestHandler() {
  let state: null | State = null;

  function postRendererRequest(
    pluginContext: RendererPreviewContext,
    msg: MessageType
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
          if (iframeWindow) {
            const notifications = getNotificationMethods(pluginContext);
            if (iframeLocationChanged(iframeWindow, iframe.src)) {
              notifications.pushStickyNotification({
                id: notificationId,
                type: 'info',
                title: 'Renderer iframe location changed',
                info: `Reload or select another fixture to reset your preview.`,
              });
            } else {
              notifications.removeStickyNotification(notificationId);
            }
          }
        },
      };
      iframeRef.addEventListener('load', state.onIframeLoad);
    } else {
      state = null;
    }
  }

  return { postRendererRequest, setIframeRef };
}

function iframeLocationChanged(iframeWindow: Window, iframeSrc: string) {
  // We cannot read the iframe location when the iframe doesn't have the same
  // origin as the main frame, due to cross-origin browser security. In this
  // case we return false to avoid entering an infinite loop.
  if (iframeSrc.indexOf('http') === 0 && !iframeSrc.match(origin)) return false;

  try {
    const { href } = iframeWindow.location;
    const locationWithoutHash = href.split('#')[0];
    return (
      locationWithoutHash !== iframeSrc &&
      // Some static servers strip .html extensions automatically
      // https://github.com/zeit/serve-handler/tree/ce35fcd4e1c67356348f4735eed88fb084af9b43#cleanurls-booleanarray
      locationWithoutHash !== iframeSrc.replace(/\.html$/, '')
    );
  } catch (err) {
    // An exception is thrown when trying to access the location of a
    // cross-origin frame, which signals that the iframe location host changed.
    return true;
  }
}

function getNotificationMethods(pluginContext: RendererPreviewContext) {
  return pluginContext.getMethodsOf<NotificationsSpec>('notifications');
}
