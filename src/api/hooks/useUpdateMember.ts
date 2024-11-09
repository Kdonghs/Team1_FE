import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type {
  UpdateMember,
  UpdateMemberData,
} from "../generated/data-contracts";
import { projectApi } from "../projectApi";

type UpdateMemberParams = {
  projectId: number;
  memberId: number;
  data: UpdateMember;
};

const updateMember = async (
  projectId: number,
  memberId: number,
  data: UpdateMember
) => {
  const testToken = getTestToken();

  const response = await projectApi.updateMember(projectId, memberId, data, {
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });
  return response.data;
};

export const useUpdateMember = (): UseMutationResult<
  UpdateMemberData,
  AxiosError,
  UpdateMemberParams
> => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMemberData, AxiosError, UpdateMemberParams>({
    mutationFn: async ({ projectId, memberId, data }) => {
      return updateMember(projectId, memberId, data);
    },
    onSuccess: (data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamProgress", projectId],
      });

      console.log("팀원 정보 수정 성공:", data);
    },
    onError: (error) => {
      console.error("팀원 정보 수정 오류:", error);
    },
  });
};
