import React from 'react';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RouterSpec } from '../Router/public';
import { NotificationsSpec } from '../Notifications/public';
import { EditFixtureButton } from './EditFixtureButton';
import { EditFixtureButtonSpec } from './public';

const { namedPlug, register } = createPlugin<EditFixtureButtonSpec>({
  name: 'editFixtureButton'
});

const ERORR_TITLE = 'Failed to open fixture';

namedPlug('fixtureActions', 'editFixture', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const core = getMethodsOf<CoreSpec>('core');
  const router = getMethodsOf<RouterSpec>('router');

  const notifications = getMethodsOf<NotificationsSpec>('notifications');
  const { pushTimedNotification } = notifications;
  const onError = React.useCallback(
    info =>
      pushTimedNotification({
        id: 'edit-fixture',
        type: 'error',
        title: ERORR_TITLE,
        info
      }),
    [pushTimedNotification]
  );

  return (
    <EditFixtureButton
      devServerOn={core.isDevServerOn()}
      selectedFixtureId={router.getSelectedFixtureId()}
      onError={onError}
    />
  );
});

export { register };
