import React from 'react';
import { IconButton32 } from '../../../components/buttons/index.js';
import { CastIcon } from '../../../components/icons/index.js';
import { NotificationItem } from '../../Notifications/spec.js';
import { copyToClipboard } from './copyToClipboard.js';

type Props = {
  devServerOn: boolean;
  rendererUrl: null | string;
  pushNotification: (notification: NotificationItem) => unknown;
};

export function RemoteButton({
  devServerOn,
  rendererUrl,
  pushNotification,
}: Props) {
  if (!devServerOn || !rendererUrl) {
    return null;
  }

  return (
    <IconButton32
      icon={<CastIcon />}
      title="Copy remote renderer URL"
      onClick={copyRendererUrlToClipboard}
    />
  );

  async function copyRendererUrlToClipboard() {
    const url = await fetchRemoteRendererUrl();
    if (!url) {
      pushNotification({
        id: 'renderer-url-copy',
        type: 'error',
        title: `Failed to fetch remote renderer URL`,
        info: 'Make sure the Cosmos server is running.',
      });
    } else {
      try {
        await copyToClipboard(url);
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
}

async function fetchRemoteRendererUrl() {
  try {
    const res = await fetch(`/_cosmos/remote-renderer-url`);
    const body = (await res.json()) as { url: string | null };
    return body.url;
  } catch (err) {
    return null;
  }
}
