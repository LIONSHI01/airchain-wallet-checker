import { loadLocalWalletList } from "./helper/local-data";
import { getWalletDetailsApi } from "./api/get-wallet-details";
import { logger } from "./helper/logger";
import { getWalletPointsApi } from "./api/get-wallet-points";

const TOO_LOW_AMOUNT = 1;

async function main() {
  const wallets = loadLocalWalletList();

  for (const wallet of wallets) {
    const { name, address } = wallet;
    const walletDetails = await getWalletDetailsApi(address);
    const walletPointsDetails = await getWalletPointsApi(address);

    const { spendable_amount } = walletDetails.data;
    const { total_points } = walletPointsDetails;
    const isBalanceTooLow = Number(spendable_amount) < TOO_LOW_AMOUNT;

    const signalEmoji = `${isBalanceTooLow ? "🔴" : "🟢"}`;

    logger.info(
      `${signalEmoji} ${name} | $${spendable_amount} | Pts: ${total_points}`
    );
  }
}

main();
