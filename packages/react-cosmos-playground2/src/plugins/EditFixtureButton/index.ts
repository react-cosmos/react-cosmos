import { createPlugin } from 'react-plugin';
import { createArrayPlug } from '../../shared/slot';
import { getMethodsOf } from '../../testHelpers/plugin';
import { CoreSpec } from './../Core/public';
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
  getProps: () => {
    const core = getMethodsOf<CoreSpec>('core');
    return {
      devServerOn: core.isDevServerOn()
    };
  }
});

export { register };
