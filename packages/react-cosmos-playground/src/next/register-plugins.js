import { register } from 'react-plugin';

register(require('./plugins/Preview').default);
register(require('./plugins/Nav').default);
register(require('./plugins/NavHeader').default);
register(require('./plugins/FixtureEditor').default);
register(require('./plugins/ResponsivePreview').default);
