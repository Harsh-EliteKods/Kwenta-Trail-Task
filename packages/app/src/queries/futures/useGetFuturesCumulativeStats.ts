import { FUTURES_ENDPOINT_OP_MAINNET } from '@kwenta/sdk/constants';
import { NetworkId } from '@kwenta/sdk/types';
import { getFuturesEndpoint } from '@kwenta/sdk/utils';
import { wei } from '@synthetixio/wei';
import request, { gql } from 'graphql-request';
import { useQuery, UseQueryOptions } from 'react-query';

import QUERY_KEYS from 'constants/queryKeys';
import ROUTES from 'constants/routes';
import Connector from 'containers/Connector';
import useIsL2 from 'hooks/useIsL2';
import logError from 'utils/logError';

import { FuturesCumulativeStats } from './types';

const useGetFuturesCumulativeStats = (options?: UseQueryOptions<FuturesCumulativeStats | null>) => {
  const API_URL = process.env.SERVER_URL || 'https://server-cu6j.onrender.com/api/';
  const { network } = Connector.useContainer();
  const isL2 = useIsL2();
  const homepage = window.location.pathname === ROUTES.Home.Root;
  // const futuresEndpoint = homepage
  // 	? FUTURES_ENDPOINT_OP_MAINNET
  // 	: getFuturesEndpoint(network?.id as NetworkId)

  return useQuery<FuturesCumulativeStats | null>(
    QUERY_KEYS.Futures.TotalTrades(network?.id as NetworkId),
    //@ts-ignore
    async () => {
      try {
        // console.log('Harsh', futuresEndpoint)
        // const response = await request(
        // 	futuresEndpoint,
        // 	gql`
        // 		query FuturesCumulativeStats {
        // 			futuresCumulativeStat(id: "0") {
        // 				totalTrades
        // 				totalTraders
        // 				totalVolume
        // 				totalLiquidations
        // 				averageTradeSize
        // 			}
        // 		}
        // 	`
        // )

        const response = await fetch(API_URL + 'stats/communityStats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        // console.log('Harsh', responseData)

        return responseData
          ? {
              totalVolume: responseData.data.volume.toString(),
              // averageTradeSize: wei(
              // 	response.futuresCumulativeStat.averageTradeSize,
              // 	18,
              // 	true
              // ).toString(),
              totalTraders: responseData.data.traders.toString(),
              totalTrades: responseData.data.trades.toString(),
              // totalLiquidations: response.futuresCumulativeStat.totalLiquidations,
            }
          : null;
      } catch (e) {
        logError(e);
        return null;
      }
    },
    { enabled: homepage || isL2, ...options },
  );
};

export default useGetFuturesCumulativeStats;
