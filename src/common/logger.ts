import 'zone.js'

const getRequestId = () => Zone.current.get('id');

export function log(message: string) {
  console.log(`Log: for request ${getRequestId()} - ${message}`)
}

export function warn(message: string) {
  console.warn(`Warn: for request ${getRequestId()} - ${message}`)
}

export function error(message: string) {
  console.error(`Error: for request ${getRequestId()} - ${message}`)
}

export function info(message: string) {
  console.info(`Info: for request ${getRequestId()} - ${message}`)
}