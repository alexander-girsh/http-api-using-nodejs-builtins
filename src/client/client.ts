import { config } from '../commonConfig';
import { PingTarget } from './pingTarget';

const PING_TARGETS: PingTarget[] = [];

for (const targetParams of config.PING_TARGETS) {
  const pingTarget = new PingTarget(targetParams);

  console.info(`Ping target ${targetParams.URL} added`);

  pingTarget.startPingRequests();

  PING_TARGETS.push(pingTarget);
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, () => {
    for (const pingTarget of PING_TARGETS) {
      pingTarget.stopPingRequests();
      pingTarget.logPingResultsDeliveryStats();
    }
    console.log('Goodbye!');
    process.removeAllListeners(); // prevents catching the 'exit' event twice
    process.exit(0);
  });
});
