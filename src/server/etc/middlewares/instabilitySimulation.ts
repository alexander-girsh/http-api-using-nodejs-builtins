import Express from 'express';

export const instabilitySimulationMiddleware: Express.RequestHandler = async (
  req,
  res,
  next
) => {
  const randomInteger = Math.trunc(Math.random() * 100);

  if (randomInteger < 60) {
    next();
  } else if (randomInteger < 80) {
    return res.status(500).send('INTERNAL SERVER ERROR');
  } else {
    return; // no response until client timeout
  }
};
