import { create, type ApiResponse } from "apisauce";
import { AirAddressDetails } from "../types";

const baseURL = "https://testnet.airchains.io/api";

const ApiInstance = create({
  baseURL,
});

export const getWalletDetailsApi = async (address: string) => {
  try {
    const res: ApiResponse<AirAddressDetails, AirAddressDetails> =
      await ApiInstance.post("/address/single-address/details", {
        walletAddress: address,
      });

    const { data } = res;
    if (data) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
