import Express from 'express';
import api from './api';
import { config } from '../commonConfig';
import bodyParser from 'body-parser';
import { PingResultsStorage } from './etc/pingResultsStorage';

const app = Express();

app.use(bodyParser.json());

app.use(api);

app.use(async (_, res) => {
  res.status(404).send('NOT FOUND');
});

app.listen(config.SERVER_PORT, config.SERVER_HOST, () => {
  console.info(
    `SERVER IS LISTENING ON ${config.SERVER_HOST}:${config.SERVER_PORT}`
  );
});

process.on('beforeExit', () => {
  PingResultsStorage.logCollectedResults();
});
