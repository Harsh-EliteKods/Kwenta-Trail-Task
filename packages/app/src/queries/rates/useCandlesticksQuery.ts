import { NetworkId } from '@kwenta/sdk/types';
import { getRatesEndpoint, getCandles } from '@kwenta/sdk/utils';
import axios from 'axios';

import { getSupportedResolution } from 'components/TVChart/utils';
import { DEFAULT_NETWORK_ID } from 'constants/defaults';
import logError from 'utils/logError';

import { DEFAULT_PYTH_TV_ENDPOINT } from './constants';
import { formatPythSymbol, mapCandles, mapPythCandles } from './utils';
import { useEffect } from 'react';

export const requestCandlesticks = async (
  currencyKey: string | null,
  minTimestamp: number,
  maxTimestamp = Math.floor(Date.now() / 1000),
  period: number,
  networkId: NetworkId = DEFAULT_NETWORK_ID,
) => {
  const ratesEndpoint = getRatesEndpoint(networkId);

  const fetchDataAndUpdateState = async () => {
    const API_URL = process.env.SERVER_URL || 'https://server-cu6j.onrender.com/api/';
    try {
      const response = await fetch(API_URL + 'stats/candles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Updated state with data:', responseData);
      return responseData.data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (period <= 3600) {
    const response = await fetchDataAndUpdateState();

    return response;
  } else {
    const response = await getCandles(
      ratesEndpoint,
      {
        first: 999999,
        where: {
          synth: `${currencyKey}`,
          timestamp_gt: `${minTimestamp}`,
          timestamp_lt: `${maxTimestamp}`,
          period: `${period}`,
        },
        orderBy: 'timestamp',
        orderDirection: 'asc',
      },
      {
        id: true,
        synth: true,
        open: true,
        high: true,
        low: true,
        close: true,
        timestamp: true,
        average: true,
        period: true,
        aggregatedPrices: true,
      },
    ).then(response => {
      return mapCandles(response);
    });

    return response;
  }
};
