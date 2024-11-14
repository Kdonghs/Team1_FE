import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { authProjectApi } from "../Api";
import type { DeleteProjectData } from "../generated/data-contracts";

const deleteProject = async (projectId: number) => {
  const response = await authProjectApi.deleteProject(projectId);
  return response.data;
};

export const useDeleteProject = (): UseMutationResult<
  DeleteProjectData,
  AxiosError,
  { projectId: number }
> => {
  return useMutation<DeleteProjectData, AxiosError, { projectId: number }>({
    mutationFn: async ({ projectId }) => {
      return deleteProject(projectId);
    },
    onSuccess: (data) => {
      console.log("프로젝트 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("프로젝트 삭제 실패:", error);
    },
  });
};
