import {
  loadLocalWalletList,
  loadLocalWalletResult,
  writeDataToLocal,
} from "./utils/local-data";
import { getWalletDetailsApi } from "./api/get-wallet-details";
import { logger } from "./utils/logger";
import { getWalletPointsApi } from "./api/get-wallet-points";
import path from "path";
import { WalletRecord, WalletResult } from "./types";
import { bot } from "./telegram";
import { TELEGRAM_CHAT_ROOM_ID } from "./constants";

const TOO_LOW_AMOUNT = 1;
const WALLET_RESULTS_FILE_NAME = "wallet_result.txt";

const directory = ".";
const filepath = path.join(directory, WALLET_RESULTS_FILE_NAME);

let wallets: WalletRecord[];
let walletResult: WalletResult[];

bot.launch();

async function init() {
  wallets = loadLocalWalletList();
  walletResult = loadLocalWalletResult();
}

async function main() {
  await init();

  let dataToWrite = "";

  for (const wallet of wallets) {
    let isEarningPoints = false;
    let pointDiff = 0;
    const { name, address } = wallet;
    const walletDetails = await getWalletDetailsApi(address);
    const walletPointsDetails = await getWalletPointsApi(address);

    const { spendable_amount } = walletDetails.data || {};
    const { total_points } = walletPointsDetails || {};
    const isBalanceTooLow = Number(spendable_amount) < TOO_LOW_AMOUNT;

    const walletResultRecord = walletResult.find((i) => i.address === address);
    if (walletResultRecord) {
      pointDiff = Number(total_points) - Number(walletResultRecord.points);
      if (pointDiff > 0) {
        isEarningPoints = true;
      }
    }

    if (!isEarningPoints) {
      const warningMsg = `🔴 ${name} is NOT earning points`;
      bot.telegram.sendMessage(TELEGRAM_CHAT_ROOM_ID, warningMsg);
    }

    if (isBalanceTooLow) {
      const warningMsg = `🔴 Balance warning
      Wallet: ${name}
      Balance: ${spendable_amount}
      `;
      bot.telegram.sendMessage(TELEGRAM_CHAT_ROOM_ID, warningMsg);
    }

    // Write Result to Local File
    const resultStringToFile = `${name},${address},${spendable_amount},${
      total_points || 0
    }\n`;

    dataToWrite += resultStringToFile;

    // Log Data to Terminal
    const signalEmoji = `${isBalanceTooLow ? "🔴" : "🟢"}`;
    const resultLogString = `${signalEmoji} ${name} | $${spendable_amount} | Pts: ${
      total_points || "Failed"
    } | Diff:${isEarningPoints ? "⚡️" : "⚠️"} ${pointDiff}`;

    logger.info(resultLogString);
  }

  writeDataToLocal(filepath, dataToWrite);
}

setInterval(main, 60 * 1000 * 30);
