export const RATES_ENDPOINT_OP_MAINNET = ``;

export const RATES_ENDPOINT_OP_GOERLI = ``;

export const RATES_ENDPOINT_GOERLI = 'https://api.thegraph.com/subgraphs/name/kwenta/goerli-main';

export const RATES_ENDPOINTS: Record<number, string> = {
  5: RATES_ENDPOINT_GOERLI,
  10: RATES_ENDPOINT_OP_MAINNET,
  420: RATES_ENDPOINT_OP_GOERLI,
};

export const getRatesEndpoint = (networkId: number): string => {
  return RATES_ENDPOINTS[networkId] || RATES_ENDPOINTS[10];
};
