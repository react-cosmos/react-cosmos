import React from 'react';
import { createRendererUrl } from 'react-cosmos-core';
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
      onClick={() => copyRendererUrlToClipboard(createRendererUrl(rendererUrl))}
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

function getFullUrl(rendererUrl: string) {
  // Renderer URL can be absolute or relative, depending on whether the renderer
  // is running on the same host/port as the playground
  if (rendererUrl.startsWith('http')) return rendererUrl;
  return new URL(rendererUrl, location.origin).toString();
}
