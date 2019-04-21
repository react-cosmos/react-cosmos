import { slash } from '../shared/slash';

export function getCwdPath(relPath?: string) {
  return relPath ? slash(process.cwd(), relPath) : process.cwd();
}
