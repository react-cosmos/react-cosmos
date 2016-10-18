let mockComponents;
let mockFixtures;

module.exports = {
  parseQuery: jest.fn(() => ({
    components: mockComponents,
    fixtures: mockFixtures,
  })),
  __setMocks: ({ components, fixtures }) => {
    mockComponents = components;
    mockFixtures = fixtures;
  },
};
