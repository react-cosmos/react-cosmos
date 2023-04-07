import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

jest.setTimeout(20000);

// This become necessary since using fetch with { method: 'HEAD' } in
// dev server tests.
// Copied from https://github.com/prisma/prisma/issues/8558#issuecomment-1129055580
global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;
