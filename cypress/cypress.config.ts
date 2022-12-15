import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '7gsfa8',
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  e2e: {
    specPattern: 'cypress/tests/**/*.{js,jsx,ts,tsx}',
  },
});
