import { useMutation } from "@tanstack/react-query";

import type {
  TaskUpdate,
  UpdateTaskData,
} from "../../api/generated/data-contracts";
import { getTestToken } from "../../components/features/Project/TokenTest";
import { projectApi } from "../projectApi";

export const useUpdateProjectTask = (taskId: number | null) => {
  return useMutation<UpdateTaskData, Error, TaskUpdate>({
    mutationFn: async (data: TaskUpdate) => {
      if (taskId === null) {
        throw new Error("Invalid task ID");
      }
      const updateData = data;

      const testToken = getTestToken();

      const response = await projectApi.updateTask(taskId, updateData, {
        headers: {
          Authorization: `Bearer ${testToken}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("태스크 수정 성공:", data);
    },
    onError: (error) => {
      console.error("태스크 수정 오류:", error);
    },
  });
};
