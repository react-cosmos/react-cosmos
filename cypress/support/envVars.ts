export function exampleName() {
  return Cypress.env('EXAMPLE_NAME') as 'webpack' | 'vite';
}

export function lazy() {
  return Cypress.env('LAZY') as 'true' | 'false';
}
