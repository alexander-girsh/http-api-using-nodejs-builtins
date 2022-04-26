import { PingTargetParams } from '../commonTypes';
import { delay } from './etc/lib';
import { WithHttpTransport } from './etc/mixins/withHttpTransport';
import { PingResultsTransport } from './pingResultsTransport';

export class PingTarget extends WithHttpTransport {
  readonly URL: PingTargetParams['URL'];
  readonly PING_INTERVAL_MS: PingTargetParams['PING_INTERVAL_MS'];
  private currentPingRequestNumber = 0;
  private pingResultsTransport = new PingResultsTransport();
  private isRunning = false;

  constructor(targetParams: PingTargetParams) {
    const { URL, PING_INTERVAL_MS, PING_TIMEOUT_MS } = targetParams;

    super({
      timeout: PING_TIMEOUT_MS,
      baseURL: URL
    });

    this.URL = URL;
    this.PING_INTERVAL_MS = PING_INTERVAL_MS;
  }

  async startPingRequests() {
    if (this.isRunning) {
      throw new Error(`target ${this.URL} is already running`);
    }
    this.isRunning = true;
    while (this.isRunning) {
      this.currentPingRequestNumber++;

      const pingStartTimestamp = Date.now();

      const targetResponseTime = await this.getTargetResponseTime();

      if (targetResponseTime === null) {
        await delay(this.PING_INTERVAL_MS);
        continue;
      }

      const timeUntilNewPingRequestMs = Math.trunc(
        this.PING_INTERVAL_MS - targetResponseTime
      );

      this.pingResultsTransport.deliverPingResult({
        pingId: this.currentPingRequestNumber,
        date: pingStartTimestamp,
        responseTime: targetResponseTime
      });

      if (timeUntilNewPingRequestMs > 0) {
        await delay(timeUntilNewPingRequestMs);
      }
    }
  }

  /**
   * @desc returns target response time ms or null if target's origin is down
   * @returns number | null
   */
  async getTargetResponseTime() {
    const requestStartedAtTimestamp = Date.now();
    const targetResponse = await this.httpTransport
      .get('/')
      .catch((e: Error) => e);

    if (targetResponse instanceof Error) {
      console.error(`origin unreachable: ${this.URL}`);
      return null;
    }

    const requestEndedAtTimestamp = Date.now();

    return requestEndedAtTimestamp - requestStartedAtTimestamp;
  }

  stopPingRequests() {
    this.isRunning = false;
  }

  logPingResultsDeliveryStats() {
    console.info(`TARGET ${this.URL}:`);
    this.pingResultsTransport.logPingResultsTransportStats();
  }
}
