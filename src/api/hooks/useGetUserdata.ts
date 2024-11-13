import { useQuery } from "@tanstack/react-query";

import type { GetUserData } from "../../api/generated/data-contracts";
import { userApi } from "../../api/userApi";
import { authSessionStorage } from "../../utils/storage";

const getUserData = async (): Promise<GetUserData | null> => {
  try {
    const token = authSessionStorage.get();
    const response = await userApi.getUser({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export const useGetUserData = () => {
  return useQuery<GetUserData | null, Error>({
    queryKey: ["userData"],
    queryFn: getUserData,
  });
};
