import { useQuery } from "@tanstack/react-query";

import { authAuthApi } from "../Api";
import type { AesDecodeData } from "../generated/data-contracts";

const getAesDecode = async (query: {
  memberCode: string;
}): Promise<AesDecodeData | null> => {
  try {
    const response = await authAuthApi.aesDecode(query);

    if (!response.data || !response.data.resultData) {
      throw new Error("User data not found");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch user data"
    );
  }
};

export const useGetAesDecode = (query: { memberCode: string }) => {
  return useQuery<AesDecodeData | null, Error>({
    queryKey: ["getAesDecode", query],
    queryFn: () => {
      return getAesDecode(query);
    },
  });
};
