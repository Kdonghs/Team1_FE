import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { authUserApi } from "../Api";
import type { UpdateMemberData, UserUpdate } from "../generated/data-contracts";

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
