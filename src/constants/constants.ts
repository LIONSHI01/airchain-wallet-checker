import { logger } from "../utils/logger";
import { retrieveEnvVariable } from "../utils/utility";

export const TELEGRAM_CHAT_ROOM_ID = Number(
  retrieveEnvVariable("TELEGRAM_CHAT_ROOM_ID", logger)
);
export const TELEGRAM_BOT_TOKEN = retrieveEnvVariable(
  "TELEGRAM_BOT_TOKEN",
  logger
);
