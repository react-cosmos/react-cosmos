import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { createPlugin, PluginContext } from 'react-plugin';
import { RendererActionSlotProps } from '../../shared/slots/RendererActionSlot';
import { CoreSpec } from '../Core/public';
import { NotificationsSpec } from '../Notifications/public';
import { EditFixtureButton } from './EditFixtureButton';
import { EditFixtureButtonSpec } from './public';

type EditFixtureButtonContext = PluginContext<EditFixtureButtonSpec>;

const { namedPlug, register } = createPlugin<EditFixtureButtonSpec>({
  name: 'editFixtureButton'
});

namedPlug<RendererActionSlotProps>(
  'rendererAction',
  'editFixture',
  ({ pluginContext, slotProps }) => {
    const { getMethodsOf } = pluginContext;
    const core = getMethodsOf<CoreSpec>('core');
    const devServerOn = core.isDevServerOn();
    const onOpen = useOpen(pluginContext, slotProps.fixtureId, devServerOn);

    React.useEffect(() => {
      return core.registerCommands({ editFixture: onOpen });
    }, [core, onOpen]);

    if (!devServerOn) {
      return null;
    }

    return <EditFixtureButton onClick={onOpen} />;
  }
);

export { register };

function useOpen(
  context: EditFixtureButtonContext,
  fixtureId: FixtureId,
  devServerOn: boolean
) {
  const onError = useErrorNotification(context);
  return React.useCallback(() => {
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

function useErrorNotification(context: EditFixtureButtonContext) {
  const { getMethodsOf } = context;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  const { pushTimedNotification } = notifications;
  return React.useCallback(
    info =>
      pushTimedNotification({
        id: 'edit-fixture',
        type: 'error',
        title: 'Failed to open fixture',
        info
      }),
    [pushTimedNotification]
  );
}

async function openFile(filePath: string) {
  const url = `/_open?filePath=${filePath}`;
  const { status } = await fetch(url, { credentials: 'same-origin' });
  return status;
}
