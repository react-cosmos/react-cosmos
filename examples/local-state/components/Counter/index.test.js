import createTestContext from 'react-cosmos-test/enzyme';
import until from 'async-until';
import fiveClicksFixture from './five-clicks.fixture';

const { mount, get, getWrapper } = createTestContext({
  fixture: fiveClicksFixture
});

beforeEach(mount);

describe('local state example', () => {
  it('has been clicked five times', () => {
    expect(get('state')).toEqual({ value: 5 });
  });

  it('is an awesome counter', () => {
    expect(get('props')).toEqual(
      expect.objectContaining({ name: 'Awesome Counter' })
    );
  });

  it('increments the counter when the button is clicked', async () => {
    getWrapper()
      .find('button')
      .simulate('click');

    await until(() => get('state').value === 6, { timeout: 1000 });
  });
});
