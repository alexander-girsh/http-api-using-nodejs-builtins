import { WithAxiosInstance } from './etc/mixins/withAxiosInstance';
import { config } from '../commonConfig';
import { PingResult } from '../commonTypes';
import { createExponentialNumbersSubsequenceGenerator, delay } from './etc/lib';

export class PingResultsTransport extends WithAxiosInstance {
  protected totalRequestsCount = 0;
  protected successfulRequestsCount = 0;
  protected serverResponseTimeoutsCount = 0;
  protected serverInternalErrorsCount = 0;

  constructor() {
    super({
      baseURL: `${config.SERVER_PROTOCOL}://${config.SERVER_HOST}:${config.SERVER_PORT}/`,
      timeout: config.CLIENT_PING_RESULTS_DELIVERY_TIMEOUT_MS
    });
  }

  async deliverPingResult(pingResult: Omit<PingResult, 'deliveryAttempt'>) {
    const deliveryStartedAt = Date.now();

    let currentDeliveryAttempt = 0;

    const exponentialNumbersSubsequenceGenerator =
      createExponentialNumbersSubsequenceGenerator(
        config.CLIENT_PING_RESULTS_DELIVERY_INITIAL_DELAY_BETWEEN_ATTEMPTS_MS
      );

    while (true) {
      currentDeliveryAttempt++;
      this.totalRequestsCount++;

      const serverResponse = await this.axiosInstance
        .post(config.SERVER_ADD_PING_RESULT_ENDPOINT, {
          ...pingResult,
          deliveryAttempt: currentDeliveryAttempt
        } as PingResult)
        .catch((e: Error & { status: number }) => e);

      if (serverResponse instanceof Error) {
        if (serverResponse.status === 500) {
          this.serverInternalErrorsCount++;
        } else {
          this.serverResponseTimeoutsCount++;
        }

        const delayBeforeNextAttempt =
          exponentialNumbersSubsequenceGenerator.next()['value'];

        if (!delayBeforeNextAttempt) {
          // base case which is always required for exponential grow
          break;
        }

        await delay(delayBeforeNextAttempt);

        continue;
      }

      this.successfulRequestsCount++;

      console.info(
        `Ping result #${
          pingResult.pingId
        } delivered successful after ${Math.trunc(
          Date.now() - deliveryStartedAt
        )}ms`
      );

      break;
    }
  }

  logPingResultsTransportStats() {
    console.info(`Ping results transporting stats:
    Total requests: ${this.totalRequestsCount}
    Successful requests: ${this.successfulRequestsCount}
    Server internal errors: ${this.serverInternalErrorsCount}
    Server response timeouts: ${this.serverResponseTimeoutsCount}
    `);
  }
}
