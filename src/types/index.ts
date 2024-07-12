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
