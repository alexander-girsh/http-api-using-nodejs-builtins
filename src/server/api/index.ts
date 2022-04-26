import { Router } from 'express';
import dataEndpoints from './data';
import { instabilitySimulationMiddleware } from '../etc/middlewares/instabilitySimulation';
import { config } from '../../commonConfig';

const router = Router();

router.use(instabilitySimulationMiddleware);

router.use(config.SERVER_ADD_PING_RESULT_ENDPOINT, dataEndpoints);

export default router;
