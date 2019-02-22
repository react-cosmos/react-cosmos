import * as React from 'react';
import { Button } from '../../../shared/components';
import { CastIcon } from '../../../shared/icons';
import { copyToClipboard } from './copyToClipboard';

export type RemoteButtonProps = {
  remoteRenderersEnabled: boolean;
  webRendererUrl: null | string;
};

export function RemoteButton({
  remoteRenderersEnabled,
  webRendererUrl
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
      // TODO: Notify success
    } catch (err) {
      // TODO: Notify error (err.message)
    }
  }
}

function getFullUrl(relativeUrl: string) {
  return `${location.origin}${relativeUrl}`;
}
