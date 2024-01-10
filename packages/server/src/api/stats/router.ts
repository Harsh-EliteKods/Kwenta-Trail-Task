import { Router, Request, Response } from 'express';
import LoggerInstance from '../../loaders/logger';
import {
  getCommunityStats,
  getLeaderboardStats,
  getMarketDetails,
  getHistory,
  getCandles,
  getPrices,
} from './controller';

const statsRouter = Router();

export async function handleCommunityStats(req: Request, res: Response) {
  try {
    const stats = await getCommunityStats();
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
    const stats = await getLeaderboardStats();
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

export async function handleMarketDetails(req: Request, res: Response) {
  try {
    const stats = await getMarketDetails();
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

export async function handleHistory(req: Request, res: Response) {
  try {
    const stats = await getHistory();
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

export async function handleCandles(req: Request, res: Response) {
  try {
    const stats = await getCandles();
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

export async function handlePrices(req: Request, res: Response) {
  try {
    const stats = await getPrices();
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

export async function handleSwap(req: Request, res: Response) {
  try {
    console.log(req.body);
    const stats = {
      from: req.body.from,
      to: req.body.to,
      amount: req.body.toAmount,
    };
    res.status(200).json({
      message: 'Swap Success',
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
statsRouter.get('/marketDetails', handleMarketDetails);
statsRouter.get('/history', handleHistory);
statsRouter.get('/candles', handleCandles);
statsRouter.get('/prices', handlePrices);
statsRouter.post('/swap', handleSwap);

export default statsRouter;
