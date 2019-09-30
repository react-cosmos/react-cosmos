import React from 'react';
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

const ERORR_TITLE = 'Failed to open fixture';

namedPlug<RendererActionSlotProps>(
  'rendererAction',
  'editFixture',
  ({ pluginContext, slotProps }) => {
    const { getMethodsOf } = pluginContext;
    const core = getMethodsOf<CoreSpec>('core');
    const onError = useErrorNotification(pluginContext);

    if (!core.isDevServerOn()) {
      return null;
    }

    return (
      <EditFixtureButton fixtureId={slotProps.fixtureId} onError={onError} />
    );
  }
);

export { register };

function useErrorNotification(pluginContext: EditFixtureButtonContext) {
  const { getMethodsOf } = pluginContext;
  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  const { pushTimedNotification } = notifications;
  return React.useCallback(
    info =>
      pushTimedNotification({
        id: 'edit-fixture',
        type: 'error',
        title: ERORR_TITLE,
        info
      }),
    [pushTimedNotification]
  );
}
