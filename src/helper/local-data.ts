import fs from "fs";

import { logger } from "./logger";
import { resolve } from "path";
import { WalletRecord, WalletResult } from "../types";

export const loadLocalWalletList = (): WalletRecord[] => {
  let walletList: WalletRecord[] = [];

  logger.info(`Loading wallet list...`);

  const poolListPath = resolve("./wallet-track-list.txt");
  const data = fs.readFileSync(poolListPath, "utf-8");

  walletList = data
    .split("\n")
    .map((a) => a.trim())
    .filter((a) => a)
    .map((a) => {
      const [name, address] = a.split(",");
      return {
        name,
        address,
      };
    });

  logger.info(`Checking ${walletList.length} wallets.`);

  return walletList;
};

export const loadLocalWalletResult = (): WalletResult[] => {
  let resultList: WalletResult[] = [];

  logger.info(`Loading wallet result...`);

  const poolListPath = resolve("./wallet_result.txt");
  const data = fs.readFileSync(poolListPath, "utf-8");

  resultList = data
    .split("\n")
    .map((a) => a.trim())
    .filter((a) => a)
    .map((a) => {
      const [name, address, balance, points] = a.split(",");
      return {
        name,
        address,
        balance,
        points,
      };
    });

  return resultList;
};

export const writeDataToLocal = (filename: string, data: string) => {
  fs.writeFile(filename, data, (e) => {
    if (e) {
      logger.error(`Error writing to file:${e}`);
    }
  });
};
