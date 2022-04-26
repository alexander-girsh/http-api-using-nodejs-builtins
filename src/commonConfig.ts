import { PingTargetParams } from './commonTypes';

export const config = {
  SERVER_PROTOCOL: 'http', // https is not supported =)
  SERVER_HOST: '0.0.0.0',
  SERVER_PORT: 8080,
  SERVER_ADD_PING_RESULT_ENDPOINT: '/data',

  CLIENT_PING_RESULTS_DELIVERY_TIMEOUT_MS: 10000,
  CLIENT_PING_RESULTS_DELIVERY_INITIAL_DELAY_BETWEEN_ATTEMPTS_MS: 10,

  PING_TARGETS: [
    {
      URL: 'https://fundraiseup.com/',
      PING_INTERVAL_MS: 1000,
      PING_TIMEOUT_MS: 30000
    }
  ] as PingTargetParams[]
};
