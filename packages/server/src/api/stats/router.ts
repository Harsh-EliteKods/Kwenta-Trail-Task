import { Router, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import { communityStats, leaderboardStats } from './controller';

const statsRouter = Router();

export async function handleCommunityStats(req: Request, res: Response) {
  try {
    const stats = await communityStats();
    res.status(200).json({
      message: 'Success',
      data: stats,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || 'Request Failed',
    });
  }
}

export async function handleLeaderboardStats(req: Request, res: Response) {
  try {
    const stats = await leaderboardStats();
    res.status(200).json({
      message: 'Success',
      data: stats,
    });
  } catch (e) {
    LoggerInstance.error(e);
    res.status(e.status || 500).json({
      message: e.message || 'Request Failed',
    });
  }
}

statsRouter.get('/communityStats', handleCommunityStats);
statsRouter.get('/leaderboardStats', handleLeaderboardStats);

export default statsRouter;