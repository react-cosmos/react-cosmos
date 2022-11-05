import React, { useCallback, useEffect } from 'react';
import {
  CoreSpec,
  NotificationsSpec,
  RendererActionSlotProps,
} from 'react-cosmos';
import { FixtureId } from 'react-cosmos-core';
import { createPlugin, PluginContext } from 'react-plugin';
import { OpenFixtureButton } from './OpenFixtureButton';
import { OpenFixtureSpec } from './spec';

type OpenFixtureContext = PluginContext<OpenFixtureSpec>;

const { namedPlug, register } = createPlugin<OpenFixtureSpec>({
  name: 'openFixture',
});

namedPlug<RendererActionSlotProps>(
  'rendererAction',
  'editFixture',
  ({ pluginContext, slotProps }) => {
    const { getMethodsOf } = pluginContext;
    const core = getMethodsOf<CoreSpec>('core');
    const devServerOn = core.isDevServerOn();
    const onOpen = useOpen(pluginContext, slotProps.fixtureId, devServerOn);

    useEffect(() => {
      return core.registerCommands({ editFixture: onOpen });
    }, [core, onOpen]);

    if (!devServerOn) {
      return null;
    }

    return <OpenFixtureButton onClick={onOpen} />;
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();

function useOpen(
  context: OpenFixtureContext,
  fixtureId: FixtureId,
  devServerOn: boolean
) {
  const onError = useErrorNotification(context);
  return useCallback(() => {
    if (!devServerOn)
      return onError('Static exports cannot access source files.');

    openFile(fixtureId.path)
      .then(httpStatus => {
        switch (httpStatus) {
          case 200:
            // No need to notify when everything is OK
            return;
          case 400:
            return onError('This looks like a bug. Please let us know!');
          case 404:
            return onError('File is missing. Weird!');
          default:
            return onError(
              'Does your OS know to open source files with your code editor?'
            );
        }
      })
      .catch(err => onError('Is the Cosmos server running?'));
  }, [fixtureId.path, onError, devServerOn]);
}

function useErrorNotification(context: OpenFixtureContext) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  const { pushTimedNotification } = notifications;
  return useCallback(
    info =>
      pushTimedNotification({
        id: 'edit-fixture',
        type: 'error',
        title: 'Failed to open fixture',
        info,
      }),
    [pushTimedNotification]
  );
}

async function openFile(filePath: string) {
  const url = `/_open?filePath=${filePath}`;
  const { status } = await fetch(url, { credentials: 'same-origin' });
  return status;
}
