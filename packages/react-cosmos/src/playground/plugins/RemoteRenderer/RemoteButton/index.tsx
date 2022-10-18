import React from 'react';
import { IconButton32 } from '../../../components/buttons';
import { CastIcon } from '../../../components/icons';
import { NotificationItem } from '../../Notifications/spec';
import { copyToClipboard } from './copyToClipboard';

type Props = {
  devServerOn: boolean;
  webRendererUrl: null | string;
  pushNotification: (notification: NotificationItem) => unknown;
};

export function RemoteButton({
  devServerOn,
  webRendererUrl,
  pushNotification,
}: Props) {
  if (!devServerOn || !webRendererUrl) {
    return null;
  }

  return (
    <IconButton32
      icon={<CastIcon />}
      title="Copy remote renderer URL"
      onClick={() => copyRendererUrlToClipboard(webRendererUrl)}
    />
  );

  async function copyRendererUrlToClipboard(url: string) {
    const fullUrl = getFullUrl(url);
    try {
      await copyToClipboard(fullUrl);
      pushNotification({
        id: 'renderer-url-copy',
        type: 'success',
        title: `Renderer URL copied to clipboard`,
        info: 'Paste the renderer URL in the address bar of another browser.',
      });
    } catch (err) {
      pushNotification({
        id: 'renderer-url-copy',
        type: 'error',
        title: `Failed to copy renderer URL to clipboard`,
        info: 'Make sure your browser supports clipboard operations.',
      });
    }
  }
}

function getFullUrl(relativeUrl: string) {
  return `${location.origin}${relativeUrl}`;
}
