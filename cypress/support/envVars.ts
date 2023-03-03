export function exampleName() {
  return Cypress.env('EXAMPLE_NAME') as 'webpack' | 'vite';
}
