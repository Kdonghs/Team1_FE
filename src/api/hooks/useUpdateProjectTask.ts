import { useMutation } from "@tanstack/react-query";

import type {
  TaskUpdate,
  UpdateTaskData,
} from "../../api/generated/data-contracts";
import { authProjectApi } from "../Api";

export const useUpdateProjectTask = (taskId: number | null) => {
  return useMutation<UpdateTaskData, Error, TaskUpdate>({
    mutationFn: async (data: TaskUpdate) => {
      if (taskId === null) {
        throw new Error("Invalid task ID");
      }
      const updateData = data;

      const response = await authProjectApi.updateTask(taskId, updateData);
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
