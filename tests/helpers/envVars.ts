export function exampleName() {
  return 'vite';
  // return Cypress.env('EXAMPLE_NAME') as 'webpack' | 'vite';
}

export function lazy() {
  return false;
  // return Cypress.env('LAZY') as 'true' | 'false';
}
