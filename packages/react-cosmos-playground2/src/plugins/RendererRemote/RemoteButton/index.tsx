import * as React from 'react';
import { Button } from '../../../shared/components';
import { CastIcon } from '../../../shared/icons';
import { NotificationsSpec } from './../../Notifications/public';
import { copyToClipboard } from './copyToClipboard';

export type RemoteButtonProps = {
  remoteRenderersEnabled: boolean;
  webRendererUrl: null | string;
  pushNotification: NotificationsSpec['methods']['pushNotification'];
};

export function RemoteButton({
  remoteRenderersEnabled,
  webRendererUrl,
  pushNotification
}: RemoteButtonProps) {
  if (!remoteRenderersEnabled || !webRendererUrl) {
    return null;
  }

  return (
    <Button
      icon={<CastIcon />}
      label="remote"
      onClick={() => copyRendererUrlToClipboard(webRendererUrl)}
    />
  );

  async function copyRendererUrlToClipboard(url: string) {
    const fullUrl = getFullUrl(url);
    try {
      await copyToClipboard(fullUrl);
      pushNotification({
        type: 'success',
        content: `Renderer URL copied to clipboard`
      });
    } catch (err) {
      pushNotification({
        type: 'error',
        content: `Failed to copy renderer URL to clipboard`
      });
    }
  }
}

function getFullUrl(relativeUrl: string) {
  return `${location.origin}${relativeUrl}`;
}
