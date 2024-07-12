import { create, type ApiResponse } from "apisauce";
import { AirAddressDetails, WalletPointsResponse } from "../types";

const baseURL = "https://points.airchains.io/api";

const ApiInstance = create({
  baseURL,
});

export const getWalletPointsApi = async (address: string) => {
  try {
    const res: ApiResponse<WalletPointsResponse, WalletPointsResponse> =
      await ApiInstance.post("/rewards-table", {
        address,
      });

    const { data } = res;
    if (data) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};
