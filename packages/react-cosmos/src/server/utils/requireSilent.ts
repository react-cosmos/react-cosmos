import { isNodeError } from './isNodeError.js';
import { requireFrom, requireModule } from './requireModule.js';

export function requireSilent(moduleId: string) {
  try {
    return requireModule(moduleId);
  } catch (err) {
    if (!isNodeError(err) || err.code !== 'MODULE_NOT_FOUND') console.log(err);
  }
}

export function requireFromSilent(fromDirectory: string, moduleId: string) {
  try {
    return requireFrom(fromDirectory, moduleId);
  } catch (err) {
    if (!isNodeError(err) || err.code !== 'MODULE_NOT_FOUND') console.log(err);
  }
}
