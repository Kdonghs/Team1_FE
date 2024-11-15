import type { UseMutationResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { GetUserData } from "../../api/generated/data-contracts";
import { authUserApi } from "../Api";
import type { UpdateMemberData, UserUpdate } from "../generated/data-contracts";

const getUserData = async (): Promise<GetUserData | null> => {
  try {
    const response = await authUserApi.getUser();

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

type UpdateMemberParams = {
  data: UserUpdate;
};

const updateUser = async (data: UserUpdate) => {
  const response = await authUserApi.updateUser(data);
  return response.data;
};

export const useUpdateUser = (): UseMutationResult<
  UpdateMemberData,
  AxiosError,
  UpdateMemberParams
> => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMemberData, AxiosError, UpdateMemberParams>({
    mutationFn: async ({ data }) => {
      return updateUser(data);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["userData"],
      });
    },
    onError: () => {},
  });
};
