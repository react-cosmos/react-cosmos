export { default as moduleExists } from './module-exists';
export { default as resolveUserPath } from './resolve-user-path';

export const defaultFileMatch = [
  '**/__fixture?(s)__/**/*.{js,jsx,ts,tsx}',
  '**/?(*.)fixture?(s).{js,jsx,ts,tsx}'
];

export const defaultExclude = [];
