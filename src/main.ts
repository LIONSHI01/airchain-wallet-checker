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
import { INTERVAL, TELEGRAM_CHAT_ROOM_ID } from "./constants";

const TOO_LOW_AMOUNT = 1;
const WALLET_RESULTS_FILE_NAME = "wallet_result.txt";

const directory = ".";
const filepath = path.join(directory, WALLET_RESULTS_FILE_NAME);

let wallets: WalletRecord[];
let walletResult: WalletResult[];

bot.launch();

async function init() {
  wallets = loadLocalWalletList("./wallet-track-list.txt");
  walletResult = loadLocalWalletResult();
}

async function main() {
  await init();

  let dataToWrite = "";
  let tgErrorMessage = "";
  try {
    for (const wallet of wallets) {
      let isEarningPoints = false;
      let pointDiff = 0;
      const { name, address } = wallet;
      const walletDetails = await getWalletDetailsApi(address);
      const walletPointsDetails = await getWalletPointsApi(address);

      const { spendable_amount } = walletDetails.data || {};
      const { total_points } = walletPointsDetails || {};
      const isBalanceTooLow = Number(spendable_amount) < TOO_LOW_AMOUNT;

      const walletResultRecord = walletResult.find(
        (i) => i.address === address
      );
      if (walletResultRecord) {
        pointDiff = Number(total_points) - Number(walletResultRecord.points);
        if (pointDiff > 0) {
          isEarningPoints = true;
        }
      }

      if (!isEarningPoints) {
        const singleEarnPointWarningMsg = `🔴 ${name} is NOT earning points \n`;
        tgErrorMessage += singleEarnPointWarningMsg;
      }

      if (isBalanceTooLow) {
        const singleBalanceWarningMsg = `
        🔴 Balance warning
        Wallet: ${name}
        Balance: ${spendable_amount}
        \n`;
        tgErrorMessage += singleBalanceWarningMsg;
      }

      // Write Result to Local File
      const resultStringToFile = `${name},${address},${spendable_amount},${
        total_points || walletResultRecord.points
      }\n`;

      dataToWrite += resultStringToFile;

      // Log Data to Terminal
      const signalEmoji = `${isBalanceTooLow ? "🔴" : "🟢"}`;
      const resultLogString = `${signalEmoji} ${name} | $${spendable_amount} | Pts: ${
        total_points || "Failed"
      } | Growth:${isEarningPoints ? "⚡️" : "⚠️"} ${pointDiff}`;

      logger.info(resultLogString);
    }
  } catch (error) {
    console.log(error);
  }

  tgErrorMessage &&
    bot.telegram.sendMessage(TELEGRAM_CHAT_ROOM_ID, tgErrorMessage);

  writeDataToLocal(filepath, dataToWrite);
}

setInterval(main, 60 * 1000 * INTERVAL);
