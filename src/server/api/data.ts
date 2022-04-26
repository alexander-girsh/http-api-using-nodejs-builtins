import { Router } from 'express';
import { config } from '../../commonConfig';
import { PingResult, PingTargetParams } from '../../commonTypes';
import { PingResultsStorage } from '../etc/pingResultsStorage';

const router = Router();

router.post('/', async (req, res) => {
  // I hardcoded the url of the only target which was requested
  // (the fundraiseup's url) to expand functionality
  // to handle the list of different targets
  // to reuse it in my own work later
  const targetURL: PingTargetParams['URL'] = config.PING_TARGETS[0]!.URL;

  const { pingId, deliveryAttempt, date, responseTime } =
    req.body as PingResult;

  PingResultsStorage.addCollectedResult(targetURL, {
    pingId,
    deliveryAttempt,
    date,
    responseTime
  });

  res.status(200).send('OK');
});

export default router;
