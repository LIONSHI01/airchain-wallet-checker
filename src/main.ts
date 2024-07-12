import { loadLocalWalletList } from "./helper/local-data";
import { getWalletDetailsApi } from "./api/get-wallet-details";
import { logger } from "./helper/logger";

async function main() {
  const wallets = loadLocalWalletList();

  for (const wallet of wallets) {
    const { name, address } = wallet;
    const walletDetails = await getWalletDetailsApi(address);
    const { spendable_amount } = walletDetails.data;

    logger.info(`${name}: ${spendable_amount}`);
  }
}

main();
