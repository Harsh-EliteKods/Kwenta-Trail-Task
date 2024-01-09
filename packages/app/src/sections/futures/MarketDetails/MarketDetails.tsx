import { ZERO_WEI } from '@kwenta/sdk/constants';
import { getDisplayAsset, formatDollars, formatPercent } from '@kwenta/sdk/utils';
import { wei } from '@synthetixio/wei';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { getColorFromPriceChange } from 'components/ColoredPrice';
import { FlexDivCol, FlexDivRow, FlexDivRowCentered } from 'components/layout/flex';
import { Body } from 'components/Text';
import { NO_VALUE } from 'constants/placeholder';
import useWindowSize from 'hooks/useWindowSize';
import { selectMarketAsset, selectMarketPriceInfo } from 'state/futures/common/selectors';
import { selectMarketInfo, selectSelectedInputHours, selectSkewAdjustedPriceInfo } from 'state/futures/selectors';
import { useAppSelector } from 'state/hooks';
import { selectPreviousDayPrices } from 'state/prices/selectors';
import media from 'styles/media';

import { MARKETS_DETAILS_HEIGHT_DESKTOP } from '../styles';

import ChartToggle from './ChartToggle';
import HistoryToggle from './HistoryToggle';
import HoursToggle from './HoursToggle';
import MarketDetail, { MarketDetailValue } from './MarketDetail';
import { MarketDataKey } from './utils';

type MarketDetailsProps = {
  mobile?: boolean;
};

interface OpenInterestDetailProps extends MarketDetailsProps {
  isLong?: boolean;
}

const MarketDetails: React.FC<MarketDetailsProps> = () => {
  //sample state of data
  const [marketData, setMarketData] = useState({
    '24H': 0,
    fundingRate: 0,
    indexPrice: 0,
    markPrice: 0,
    openInterestL: 0,
    openInterestS: 0,
    title: 'market',
    totalInterest: 0,
    skewDen: 0,
    skewNum: 0,
  });

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      const API_URL = process.env.SERVER_URL || 'http://localhost:8080/api/';
      try {
        const response = await fetch(API_URL + 'stats/marketDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        setMarketData(responseData.data);
        console.log('HELLLO', marketData.markPrice);

        console.log('Updated state with data:', responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataAndUpdateState();

    const interval = setInterval(fetchDataAndUpdateState, 3000);

    return () => clearInterval(interval);
  }, []);

  const { deviceType } = useWindowSize();
  const mobileOrTablet = deviceType !== 'desktop';

  const MarketPriceDetail: React.FC<MarketDetailsProps> = memo(({ mobile }) => {
    const dt = marketData.markPrice;

    const randomNumber = Math.floor(Math.random() * 100);

    const randomColor = randomNumber % 2 === 0 ? 'red' : 'green';

    return (
      <MarketDetail
        mobile={mobile}
        //@ts-ignore
        color={randomColor}
        //@ts-ignore
        value={`$${dt}`.slice(0, 8)}
        dataKey={MarketDataKey.marketPrice}
      />
    );
  });

  const IndexPriceDetail: React.FC<MarketDetailsProps> = memo(({ mobile }) => {
    const dt = marketData.indexPrice;

    return <MarketDetail mobile={mobile} dataKey={MarketDataKey.indexPrice} value={`$${dt}`.slice(0, 8)} />;
  });

  const DailyChangeDetail: React.FC<MarketDetailsProps> = memo(({ mobile }) => {
    const dt = marketData['24H'].toString().slice(0, 4);
    const randomNumber = Math.floor(Math.random() * 100);
    const randomColor = randomNumber % 2 === 0 ? 'red' : 'green';
    return <MarketDetail mobile={mobile} dataKey={MarketDataKey.dailyChange} value={`-${dt}%`} color={randomColor} />;
  });

  const HourlyFundingDetail: React.FC<MarketDetailsProps> = memo(({ mobile }) => {
    const { t } = useTranslation();

    const randomNumber = Math.floor(Math.random() * 100);
    const randomColor = randomNumber % 2 === 0 ? 'red' : 'green';
    const dt = marketData.fundingRate.toString().slice(0, 4);

    return (
      <MarketDetail
        dataKey={t('futures.market.info.hourly-funding')}
        value={`${dt}%`}
        color={randomColor}
        mobile={mobile}
        extra={<HoursToggle />}
      />
    );
  });

  const MarketSkew: React.FC<MarketDetailsProps> = memo(({ mobile }) => {
    const sn = marketData.skewNum.toString().slice(0, 4);
    const sd = marketData.skewDen.toString().slice(0, 4);
    return (
      <MarketDetail
        mobile={mobile}
        dataKey={MarketDataKey.skew}
        value={
          <>
            <MarketDetailValue color="green" value={`${sn}%`} mobile={mobile} />
            {'/'}
            <MarketDetailValue color="red" value={`${sd}%`} mobile={mobile} />
          </>
        }
      />
    );
  });

  const OpenInterestDetail: React.FC<OpenInterestDetailProps> = memo(({ mobile, isLong }) => {
    const R = marketData.openInterestS.toString().slice(0, 5);
    const L = marketData.openInterestL.toString().slice(0, 5);
    const T = marketData.totalInterest.toString().slice(0, 5);

    const mobileValue = (
      <FlexDivCol>
        <div>{R}</div>
        <Body mono size="small" color="secondary" weight="bold">
          {T}
        </Body>
      </FlexDivCol>
    );

    const desktopValue = `${L}/${T}`;

    const dataKey = `openInterest${isLong ? 'Long' : 'Short'}${mobile ? 'Mobile' : ''}` as keyof typeof MarketDataKey;

    return (
      <MarketDetail mobile={mobile} dataKey={MarketDataKey[dataKey]} value={mobile ? mobileValue : desktopValue} />
    );
  });

  const SelectedMarketDetailsView = mobileOrTablet ? (
    <MarketDetailsContainer mobile={mobileOrTablet}>
      <IndexPriceDetail mobile={mobileOrTablet} />
      <MarketSkew mobile={mobileOrTablet} />
      <HourlyFundingDetail mobile={mobileOrTablet} />
      <MarketPriceDetail mobile={mobileOrTablet} />
      <DailyChangeDetail mobile={mobileOrTablet} />
      <FlexDivRow columnGap="25px">
        <OpenInterestDetail isLong mobile={mobileOrTablet} />
        <OpenInterestDetail mobile={mobileOrTablet} />
      </FlexDivRow>
    </MarketDetailsContainer>
  ) : (
    <MarketDetailsContainer>
      <MarketPriceDetail />
      <IndexPriceDetail />
      <DailyChangeDetail />
      <OpenInterestDetail isLong />
      <OpenInterestDetail />
      <MarketSkew />
      <HourlyFundingDetail />
    </MarketDetailsContainer>
  );

  return (
    <MainContainer mobile={mobileOrTablet}>
      {SelectedMarketDetailsView}
      {!mobileOrTablet && (
        <ToggleContainer justifyContent="flex-end" columnGap="30px">
          <ChartToggle />
          <HistoryToggle />
        </ToggleContainer>
      )}
    </MainContainer>
  );
};

const MainContainer = styled.div<{ mobile?: boolean }>`
  display: grid;
  align-items: center;
  height: ${MARKETS_DETAILS_HEIGHT_DESKTOP}px;
  overflow-y: visible;
  grid-template-columns: 1fr 280px;
  border-bottom: ${props => (props.mobile ? 0 : props.theme.colors.selectedTheme.border)};

  ${props =>
    props.mobile &&
    css`
      display: flex;
      flex-direction: column;
      height: auto;
      height: ${MARKETS_DETAILS_HEIGHT_DESKTOP * 2}px;
    `}
`;

export const MarketDetailsContainer = styled.div<{ mobile?: boolean }>`
  flex: 1;
  gap: 20px;
  padding: 10px 45px 10px 15px;
  overflow-x: scroll;
  scrollbar-width: none;
  display: flex;
  align-items: center;
  width: 100%;
  overflow-y: visible;

  & > div {
    margin-right: 30px;
  }

  ${media.lessThan('xl')`
		gap: 10px;
		& > div {
			margin-right: 10px;
		}
	`}

  ${media.lessThan('lg')`
		gap: 6px;
	`}

	.heading, .value {
    white-space: nowrap;
  }

  ${props => css`
    .heading {
      color: ${props.theme.colors.selectedTheme.text.label};
    }

    .value {
      color: ${props.theme.colors.selectedTheme.text.value};
    }

    .green {
      color: ${props.theme.colors.selectedTheme.green};
    }

    .red {
      color: ${props.theme.colors.selectedTheme.red};
    }

    .paused {
      color: ${props.theme.colors.selectedTheme.gray};
    }

    ${props.mobile &&
    css`
      height: auto;
      width: 100%;
      padding: 15px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr 1fr;
      grid-gap: 15px 25px;
      justify-items: start;
      align-items: start;
      justify-content: start;
      ${media.lessThan('md')`
				margin: 0px;
				& > div {
					margin-right: 30px;
				}
			`}

      border-left: none;
      .heading {
        margin-bottom: 2px;
      }
    `}
  `}
`;

const ToggleContainer = styled(FlexDivRowCentered)`
  padding-right: 17.5px;
`;

export default MarketDetails;
