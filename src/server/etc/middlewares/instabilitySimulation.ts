import { config } from '../../../commonConfig';
import http from 'http';

/**
 * @desc returns true if request handling should be interrupted,
 * @returns {boolean}
 */
export const instabilitySimulationMiddleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse
): boolean => {
  const randomInteger = Math.trunc(Math.random() * 100);

  if (
    randomInteger <=
    config.SERVER.INSTABILITY_SIMULATION.INTERNAL_ERRORS_PERCENTAGE
  ) {
    // sending 500
    res.statusCode = 500;
    res.write('INTERNAL SERVER ERROR');
    res.end();
    return true;
  } else if (
    randomInteger <=
    config.SERVER.INSTABILITY_SIMULATION.INTERNAL_ERRORS_PERCENTAGE +
      config.SERVER.INSTABILITY_SIMULATION.TIMEOUTS_PERCENTAGE
  ) {
    // sending nothing, imitating timeout
    return true;
  }

  // allowing server to continue req handling
  return false;
};
