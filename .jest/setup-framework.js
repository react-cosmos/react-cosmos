import 'jest-dom/extend-expect';

// Some end to end server tests can be very slow...
// Especially slow are the server tests which test webpack compilation
jest.setTimeout(180000); // 3min
