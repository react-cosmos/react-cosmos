import { isNodeError } from './isNodeError.js';
import { resolve, resolveFrom } from './resolve.js';

export function resolveSilent(moduleId: string) {
  try {
    return resolve(moduleId);
  } catch (err) {
    if (!isNodeError(err) || err.code !== 'MODULE_NOT_FOUND') console.log(err);
    return null;
  }
}

export function resolveFromSilent(fromDirectory: string, moduleId: string) {
  try {
    return resolveFrom(fromDirectory, moduleId);
  } catch (err) {
    if (!isNodeError(err) || err.code !== 'MODULE_NOT_FOUND') console.log(err);
    return null;
  }
}
