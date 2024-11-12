import { useMutation } from "@tanstack/react-query";

import type {
  CreateTaskData,
  TaskCreate,
} from "@/api/generated/data-contracts";

import { getTestToken } from "../../components/features/Project/TokenTest";
import { projectApi } from "../projectApi";

const postTask = async (
  projectId: number,
  data: TaskCreate
): Promise<CreateTaskData> => {
  try {
    const testToken = getTestToken();

    const response = await projectApi.createTask(projectId, data, {
      headers: {
        Authorization: `Bearer ${testToken}`,
      },
    });

    if (!response.data) {
      throw new Error("Task creation failed");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create task"
    );
  }
};

export const usePostProjectTask = (projectId: number | null) => {
  return useMutation<CreateTaskData, Error, TaskCreate>({
    mutationFn: (data: TaskCreate) => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }
      return postTask(projectId, data);
    },
  });
};
