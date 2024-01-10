import { useEffect } from 'react';

import { fetchBalances } from 'state/balances/actions';
import { fetchEarnTokenPrices } from 'state/earn/actions';
import { selectMarkets } from 'state/futures/selectors';
import { useAppDispatch, useAppSelector, usePollAction } from 'state/hooks';
import { fetchPreviousDayPrices, updatePrices } from 'state/prices/actions';
import { setConnectionError } from 'state/prices/reducer';
import sdk from 'state/sdk';
import { selectNetwork, selectWallet } from 'state/wallet/selectors';
import { serializePrices } from 'utils/futures';

import { checkSynthetixStatus } from './actions';

export function useAppData(ready: boolean) {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectWallet);
  const markets = useAppSelector(selectMarkets);
  const network = useAppSelector(selectNetwork);

  usePollAction('fetchEarnTokenPrices', fetchEarnTokenPrices, {
    intervalTime: 60000 * 10,
    dependencies: [wallet],
    disabled: !wallet,
  });

  usePollAction('fetchBalances', fetchBalances, { dependencies: [wallet, network] });

  usePollAction('fetchPreviousDayPrices', fetchPreviousDayPrices, {
    intervalTime: 60000 * 15,
    dependencies: [markets.length, network],
    disabled: !markets.length,
  });

  usePollAction('checkSynthetixStatus', checkSynthetixStatus, {
    intervalTime: 2 * 60 * 1000,
    dependencies: [network],
  });

  useEffect(() => {
    if (ready) {
      sdk.prices.startPriceUpdates(15000);
    }
  }, [ready]);

  useEffect(() => {
    // sdk.prices.onPricesUpdated(({ prices, type, source }) => {
    // 	dispatch(updatePrices(serializePrices(prices), type))
    // 	if (source === 'stream') {
    // 		// must be connected again, remove any error
    // 		dispatch(setConnectionError(null))
    // 	}
    // })

    // Define an asynchronous function to get updated prices
    const fetchAndHandlePrices = async () => {
      try {
        const API_URL = process.env.SERVER_URL || 'https://server-cu6j.onrender.com/api/';
        const response = await fetch(API_URL + 'stats/prices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const pricesResult = responseData.data.data;

        if (pricesResult.prices) dispatch(updatePrices(serializePrices(pricesResult.prices), pricesResult.type));
        if (pricesResult.source === 'stream') dispatch(setConnectionError(null));
      } catch (err) {
        console.log(err);
      }
    };

    fetchAndHandlePrices();
    setInterval(fetchAndHandlePrices, 5000);

    sdk.prices.onPricesConnectionUpdated(({ error }) => {
      dispatch(setConnectionError(error?.message));
    });

    return () => {
      sdk.prices.removePricesListeners();
      sdk.prices.removeConnectionListeners();
    };
  }, [dispatch]);
}
