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

export async function marketDetails() {
  try {
    const name = 'market';
    const data = await (await database()).collection('stats').findOne({ title: name });

    const randomDecimal = (min, max) => {
      return (Math.random() * (max - min) + min).toFixed(2);
    };

    // Update the fields with random numbers
    data.markPrice = parseFloat(data.markPrice) + parseFloat(randomDecimal(1.0, 2.0));
    data.indexPrice = parseFloat(data.indexPrice) + parseFloat(randomDecimal(1.0, 2.0));
    data['24H'] = parseFloat(data['24H']) + parseFloat(randomDecimal(0.0, 1.0));

    console.log(data);
    return data;
  } catch (e) {
    LoggerInstance.error(e);
    throw {
      message: 'Unauthorized Access',
      status: 401,
    };
  }
}

export async function history() {
  try {
    const name = 'history';
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

export async function candles() {
  try {
    const name = 'candles';
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
