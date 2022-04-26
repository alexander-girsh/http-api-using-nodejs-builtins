import { WithHttpTransport } from './etc/mixins/withHttpTransport';
import { config } from '../commonConfig';
import { PingResult } from '../commonTypes';
import { createExponentialNumbersSubsequenceGenerator, delay } from './etc/lib';
import { HttpTransportError } from './etc/httpTransport';

export class PingResultsTransport extends WithHttpTransport {
  protected totalRequestsCount = 0;
  protected successfulRequestsCount = 0;
  protected serverResponseTimeoutsCount = 0;
  protected serverInternalErrorsCount = 0;

  constructor() {
    super({
      // https protocol is not supported according the task
      baseURL: `http://${config.SERVER.HOST}:${config.SERVER.PORT}/`,
      timeout: config.CLIENT.PING_RESULTS_DELIVERY_TIMEOUT_MS
    });
  }

  async deliverPingResult(pingResult: Omit<PingResult, 'deliveryAttempt'>) {
    const deliveryStartedAt = Date.now();

    let currentDeliveryAttempt = 0;

    const exponentialNumbersSubsequenceGenerator =
      createExponentialNumbersSubsequenceGenerator(
        config.CLIENT.PING_RESULTS_DELIVERY_INITIAL_DELAY_BETWEEN_ATTEMPTS_MS,
        config.CLIENT.PING_RESULTS_DELIVERY_MAX_DELAY_BETWEEN_ATTEMPTS_MS
      );

    while (true) {
      currentDeliveryAttempt++;
      this.totalRequestsCount++;

      const serverResponse = await this.httpTransport
        .post(config.SERVER.ADD_PING_RESULT_ENDPOINT, {
          ...pingResult,
          deliveryAttempt: currentDeliveryAttempt
        } as PingResult)
        .catch((e: HttpTransportError) => e);

      const delayBeforeNextAttempt =
        exponentialNumbersSubsequenceGenerator.next()['value'];

      if (serverResponse instanceof HttpTransportError) {
        let reasonMessage: string;
        if (serverResponse.statusCode === 500) {
          reasonMessage = 'INTERNAL SERVER ERROR';
          this.serverInternalErrorsCount++;
        } else {
          reasonMessage = 'TIMEOUT';
          this.serverResponseTimeoutsCount++;
        }

        if (!delayBeforeNextAttempt) {
          console.warn(
            `Ping result #${pingResult.pingId} not delivered after ${
              Date.now() - deliveryStartedAt
            }ms and ${currentDeliveryAttempt} attempts`
          );
          // base case which is always required for exponential grow
          break;
        }

        console.warn(
          `Ping result #${pingResult.pingId}, attempt #${currentDeliveryAttempt}, not delivered: ${reasonMessage}. Delay before next attempt: ${delayBeforeNextAttempt}ms`
        );

        await delay(delayBeforeNextAttempt);

        continue;
      }

      this.successfulRequestsCount++;

      console.info(
        `Ping result #${
          pingResult.pingId
        } delivered successful after ${Math.trunc(
          Date.now() - deliveryStartedAt
        )}ms and ${currentDeliveryAttempt} attempts`
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
