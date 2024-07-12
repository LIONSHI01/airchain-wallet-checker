export type WalletRecord = { name: string; address: string };
export type AirAddressDetails = {
  data: WalletData;
  description: string;
  message: string;
  status: boolean;
};

type WalletData = {
  address: string;
  account_type: string;
  pub_key: string;
  balance: string;
  spendable_amount: string;
  reward_amount: string;
  delegation_amount: string;
};

export interface WalletPointsResponse {
  data: {
    total_stations: string;
    total_points: string;
    stations: Station[];
  };
}

export interface Station {
  id: number;
  tx_hash: string;
  tx_height: number;
  creator: string;
  station_id: string;
  latest_pod: number;
  points: number;
  eligible: boolean;
  da_type: string;
  station_info: string;
  status: string;
}
