import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type { UpdateMemberData, UserUpdate } from "../generated/data-contracts";
import { userApi } from "../userApi";

type UpdateMemberParams = {
  data: UserUpdate;
};

const updateUser = async (data: UserUpdate) => {
  const testToken = getTestToken();

  const response = await userApi.updateUser(data, {
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });
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
