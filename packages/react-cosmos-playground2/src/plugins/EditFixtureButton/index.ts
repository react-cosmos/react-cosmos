import { createPlugin } from 'react-plugin';
import { createArrayPlug } from '../../shared/slot';
import { CoreSpec } from './../Core/public';
import { RouterSpec } from './../Router/public';
import { EditFixtureButton, EditFixtureButtonProps } from './EditFixtureButton';
import { EditFixtureButtonSpec } from './public';

const { plug, register } = createPlugin<EditFixtureButtonSpec>({
  name: 'editFixtureButton'
});

plug({
  slotName: 'fixtureActions',
  render: createArrayPlug<EditFixtureButtonProps>(
    'fixtureActions',
    EditFixtureButton
  ),
  getProps: ({ getMethodsOf }) => {
    const core = getMethodsOf<CoreSpec>('core');
    const router = getMethodsOf<RouterSpec>('router');
    return {
      devServerOn: core.isDevServerOn(),
      selectedFixtureId: router.getSelectedFixtureId()
    };
  }
});

export { register };
