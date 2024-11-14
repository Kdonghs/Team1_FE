import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { authProjectApi } from "../Api";
import type { DeleteTaskData } from "../generated/data-contracts";

const deleteProjectTask = async (taskId: number) => {
  const response = await authProjectApi.deleteTask(taskId);
  return response.data;
};

export const useDeleteProjectTask = (): UseMutationResult<
  DeleteTaskData,
  AxiosError,
  { taskId: number }
> => {
  return useMutation<DeleteTaskData, AxiosError, { taskId: number }>({
    mutationFn: async ({ taskId }) => {
      return deleteProjectTask(taskId);
    },
    onSuccess: (data) => {
      console.log("태스크 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("태스크 삭제 실패:", error);
    },
  });
};
