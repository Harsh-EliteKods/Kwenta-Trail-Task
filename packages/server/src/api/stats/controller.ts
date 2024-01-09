import database from '../../loaders/database';
import LoggerInstance from '../../loaders/logger';

export async function communityStats() {
  try {
    const name = 'communityStats';
    const user = await (await database()).collection('stats').findOne({ title: name });
    console.log(user);
    return user;
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      message: 'Unauthorized Access',
      status: 401,
    };
  }
}

export async function leaderboardStats() {
  try {
    const name = 'leaderboard';
    const user = await (await database()).collection('stats').findOne({ title: name });
    console.log(user);
    return user;
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      message: 'Unauthorized Access',
      status: 401,
    };
  }
}
