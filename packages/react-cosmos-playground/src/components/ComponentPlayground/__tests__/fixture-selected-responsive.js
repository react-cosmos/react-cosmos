import until from 'async-until';
import { register } from 'react-plugin';
import { createContext } from '../../../utils/enzyme';
import { ResponsiveIcon } from '../../SvgIcon';
import responsivePreviewPlugin from '../../../plugins/ResponsivePreview';
import { HeaderButton } from '../../../plugins/ResponsivePreview/HeaderButton';
import { Preview } from '../../../plugins/ResponsivePreview/Preview';
import { SizeButton } from '../../../plugins/ResponsivePreview/Preview/Header/SizeButton';
import fixture from '../__fixtures__/selected-responsive';

const postMessage = jest.fn();
const { mount, getWrapper, getRef } = createContext({
  fixture,
  async beforeInit() {
    await until(() => getRef().previewIframeEl);
    getRef().previewIframeEl = {
      contentWindow: {
        postMessage
      }
    };
  }
});

beforeAll(() => {
  register(responsivePreviewPlugin);
});

afterAll(() => {
  // TODO: unregisterPlugin(pluginId)
});

describe('CP with fixture with responsive viewport', () => {
  beforeEach(mount);

  it('renders HeaderButton list', () => {
    expect(getWrapper(HeaderButton)).toHaveLength(1);
  });

  it('renders Preview list', () => {
    expect(getWrapper(Preview)).toHaveLength(1);
  });

  it('renders loader iframe', () => {
    expect(getWrapper('iframe')).toHaveLength(1);
  });

  it('renders a control for every device', () => {
    const { devices } = fixture.props.options.plugin.responsivePreview;
    devices.forEach(device => {
      expect(
        getWrapper(SizeButton).find(`[label="${device.label}"]`)
      ).toHaveLength(1);
    });
  });

  it('renders header button', () => {
    // There's no better way that to check for the icon atm
    expect(getWrapper(ResponsiveIcon)).toHaveLength(1);
  });
});
