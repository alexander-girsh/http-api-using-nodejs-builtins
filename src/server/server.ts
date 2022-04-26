import http from 'http';
import { config } from '../commonConfig';
import { instabilitySimulationMiddleware } from './etc/middlewares/instabilitySimulation';
import { onPingResultSaveRequest } from './api/data';
import { PingResultsStorage } from './etc/pingResultsStorage';

const server = new http.Server(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      if (instabilitySimulationMiddleware(req, res)) {
        return;
      }

      switch (req.method) {
        case 'POST': {
          switch (req.url) {
            case config.SERVER.ADD_PING_RESULT_ENDPOINT: {
              await onPingResultSaveRequest(req, res);
              return;
            }
          }
        }
      }

      res.statusCode = 404;
      res.write('NOT FOUND');
      res.end();
    } catch (e: any | Error) {
      console.error(e);
      if (res.finished) {
        return;
      }
      res.statusCode = 503;
      res.write('UNKNOWN SERVER ERROR');
      res.end();
    }
  }
);

server.listen(config.SERVER.PORT, config.SERVER.HOST, () => {
  console.info(
    `Server is listening on ${config.SERVER.HOST}:${config.SERVER.PORT}`
  );
});

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, () => {
    PingResultsStorage.logCollectedResults();
    console.info('Goodbye!');
    process.removeAllListeners(); // prevents catching the 'exit' event twice
    process.exit(0);
  });
});
