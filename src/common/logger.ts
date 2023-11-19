import 'zone.js';

const getRequestId = (): string => Zone.current.get('id');

function internalLog(type: 'log' | 'warn' | 'error' | 'info', message: string | Error): void {
  if (process.env.NODE_ENV !== 'test')
    console[type](`${type.toUpperCase()}: for request ${getRequestId()} - ${message}`);
}

export function log(message: string): void {
  internalLog('log', message);
}

export function warn(message: string): void {
  internalLog('warn', message);
}

export function error(message: string | Error): void {
  internalLog('error', message);
}

export function info(message: string): void {
  internalLog('info', message);
}
