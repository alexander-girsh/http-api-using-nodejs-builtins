import { PingTargetParams } from './commonTypes';

export const config = {
  SERVER: {
    HOST: '0.0.0.0',
    PORT: 8080,
    ADD_PING_RESULT_ENDPOINT: '/data',
    INSTABILITY_SIMULATION: {
      ENABLED: true,
      INTERNAL_ERRORS_PERCENTAGE: 20,
      TIMEOUTS_PERCENTAGE: 20
    }
  },
  CLIENT: {
    PING_RESULTS_DELIVERY_TIMEOUT_MS: 10_000,
    PING_RESULTS_DELIVERY_INITIAL_DELAY_BETWEEN_ATTEMPTS_MS: 100,
    PING_RESULTS_DELIVERY_MAX_DELAY_BETWEEN_ATTEMPTS_MS: 30_000
  },

  PING_TARGETS: [
    {
      URL: 'https://fundraiseup.com',
      PING_INTERVAL_MS: 1000,
      PING_TIMEOUT_MS: 30000
    }
  ] as PingTargetParams[]
};
