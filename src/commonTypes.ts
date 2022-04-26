export type Timestamp = number;

export type PingTargetParams = {
  URL: string;
  PING_INTERVAL_MS: number;
  PING_TIMEOUT_MS: number;
};

export type PingResult = {
  pingId: number;
  deliveryAttempt: number;
  date: Timestamp;
  responseTime: number;
};
