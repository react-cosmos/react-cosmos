import { requireFrom } from './requireModule.js';

export function requireFromSilent(fromDirectory: string, moduleId: string) {
  try {
    return requireFrom(fromDirectory, moduleId);
  } catch (err) {
  }
}
