import { configure } from 'enzyme';

global.requestAnimationFrame = cb => setTimeout(cb, 0);

// We need to import this after requestAnimationFrame shim is added
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });
