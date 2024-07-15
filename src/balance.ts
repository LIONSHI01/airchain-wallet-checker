import { getWalletDetailsApi } from "./api/get-wallet-details";
import { WalletRecord } from "./types";
import { loadLocalWalletList, logger } from "./utils";

type WalletType = "all" | "water";
const argvs = process.argv;

const WATER_WALLET_BALANCE_LIMIT = 0.01;
const WORKER_WALLET_BALANCE_LIMIT = 1;

let wallets: WalletRecord[] = [];

const walletType = argvs[3] as WalletType;
const listFilePath = {
  water: "./water_wallet_list.txt",
  all: "./wallet-track-list.txt",
};

function init() {
  if (!listFilePath)
    throw new Error(
      `No Wallet list found for command input --type ${walletType}`
    );

  wallets = loadLocalWalletList(listFilePath[walletType]);
}

async function main() {
  init();

  const walletBalancePromises = wallets.map(async (wallet) => {
    const { name, address } = wallet;
    const walletDetails = await getWalletDetailsApi(address);
    const { spendable_amount } = walletDetails.data || {};

    const isBalanceTooHigh = walletBalanceLimitChecker(
      walletType,
      Number(spendable_amount)
    );

    const signalEmoji = `${isBalanceTooHigh ? "🔴" : "🟢"}`;
    const resultLogString = `${signalEmoji} ${name} | $${spendable_amount}`;

    logger.info(resultLogString);
  });

  Promise.all(walletBalancePromises);
}

function walletBalanceLimitChecker(walletType: WalletType, balance: number) {
  let isValid = false;
  switch (walletType) {
    case "all":
      isValid = balance > WORKER_WALLET_BALANCE_LIMIT;
    case "water":
      isValid = balance < WATER_WALLET_BALANCE_LIMIT;
    default:
      isValid = false;
  }

  return isValid;
}

main();
