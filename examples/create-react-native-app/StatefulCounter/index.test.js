import { Button } from 'react-native';
import { create as renderer } from 'react-test-renderer';
import createContext from 'react-cosmos-test/generic';
import fixture from './index.fixture';

const { mount, getWrapper } = createContext({ renderer, fixture });

beforeEach(mount);

it('displays mocked count', async () => {
  expect(getButtonProps().title).toBe('Clicked 5 times');
});

it('displays incremented count', async () => {
  const { onPress } = getButtonProps();
  onPress();
  onPress();
  expect(getButtonProps().title).toBe('Clicked 7 times');
});

function getButtonProps() {
  return getWrapper().root.findByType(Button).props;
}
