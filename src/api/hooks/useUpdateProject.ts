import { useMutation } from "@tanstack/react-query";

import type {
  ProjectUpdate,
  SingleResultProjectDetail,
} from "../../api/generated/data-contracts";
import { authProjectApi } from "../Api";

export const useUpdateProject = (projectId: number | null) => {
  return useMutation<SingleResultProjectDetail, Error, ProjectUpdate>({
    mutationFn: async (data: ProjectUpdate) => {
      if (projectId === null) {
        throw new Error("Invalid project ID");
      }
      const updateData = data;

      const response = await authProjectApi.updateProject(
        projectId,
        updateData
      );
      return response.data;
    },
  });
};
