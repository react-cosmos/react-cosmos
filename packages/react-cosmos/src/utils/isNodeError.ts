export function isNodeError(err: any): err is NodeJS.ErrnoException {
  return err && err.stack && err.message;
}
