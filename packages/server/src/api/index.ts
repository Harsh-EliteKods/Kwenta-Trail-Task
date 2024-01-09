import { Router } from 'express';
// import userRouter from './user/router';
import statsRouter from './stats/router';

export default (): Router => {
  const app = Router();

  // app.use('/user', userRouter);
  app.use('/stats', statsRouter);

  return app;
};
