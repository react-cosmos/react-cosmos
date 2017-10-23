// @flow

type LogType = 'log' | 'warn' | 'error';

// TODO: Cache per message/type
let alreadyLogged = false;

export function log(msg: string, type: LogType = 'log') {
  if (!alreadyLogged) {
    console[type](msg);
    alreadyLogged = true;
  }
}

export function warn(msg: string) {
  log(msg, 'warn');
}
