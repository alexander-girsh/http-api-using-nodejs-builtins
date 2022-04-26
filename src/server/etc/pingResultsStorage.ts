import { PingResult, PingTargetParams } from '../../commonTypes';

export abstract class PingResultsStorage {
  static COLLECTED_PING_RESULTS: Map<PingTargetParams['URL'], PingResult[]> =
    new Map();

  static addCollectedResult(
    targetURL: PingTargetParams['URL'],
    pingResult: PingResult
  ) {
    if (!this.COLLECTED_PING_RESULTS.has(targetURL)) {
      this.COLLECTED_PING_RESULTS.set(targetURL, []);
    }

    this.COLLECTED_PING_RESULTS.get(targetURL)!.push(pingResult);

    console.info(
      `Received ping result added. Target: ${targetURL}. Values: ${JSON.stringify(
        pingResult
      )}`
    );
  }

  static logCollectedResults() {
    for (const [targetURL, pingResults] of Array.from(
      this.COLLECTED_PING_RESULTS.entries()
    )) {
      const targetResponseTimes = pingResults.map(
        (pingResult) => pingResult.responseTime
      );

      // here I clone arr cause Array.prototype.sort() is mutates the source arr
      // math.floor is used to prevent out-of-range err
      // bcz it rounds down to the nearest int
      const medianPingTime = [...targetResponseTimes].sort()[
        Math.floor(targetResponseTimes.length / 2)
      ];

      const averagePingTime = Math.trunc(
        targetResponseTimes.reduce<number>(
          (sum, current) => (sum += current),
          0
        ) / targetResponseTimes.length
      );

      console.info(
        `Summary for target ${targetURL}:
         Average response time: ${averagePingTime}ms
         Median response time: ${medianPingTime}ms`
      );
    }
  }
}
