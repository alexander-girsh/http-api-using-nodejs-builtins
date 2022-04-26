import { PingResult, PingTargetParams } from '../../../commonTypes';
import { config } from '../../../commonConfig';
import { PingResultsStorage } from '../../etc/pingResultsStorage';
import http from 'http';

export const onPingResultSaveRequest = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  // I hardcoded the url of the only target which was requested
  // (the fundraiseup's url) to expand functionality
  // to handle the list of different targets
  // to reuse it in my own work later
  const targetURL: PingTargetParams['URL'] = config.PING_TARGETS[0]!.URL;

  const { pingId, deliveryAttempt, date, responseTime } = JSON.parse(
    await readRequestBody(req)
  );

  PingResultsStorage.addCollectedResult(targetURL, {
    pingId,
    deliveryAttempt,
    date,
    responseTime
  });

  res.statusCode = 200;
  res.write('OK');
  res.end();
};

const readRequestBody = (req: http.IncomingMessage): Promise<string> =>
  new Promise((resolve) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString());
    });
  });
