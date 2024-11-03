import { useMutation } from "@tanstack/react-query";

import type {
  ProjectUpdate,
  SingleResultProjectDetail,
} from "../../api/generated/data-contracts";
import { projectApi } from "../projectApi";

export const useUpdateProject = (projectId: number | null) => {
  return useMutation<SingleResultProjectDetail, Error, ProjectUpdate>({
    mutationFn: async (data: ProjectUpdate) => {
      if (projectId === null) {
        throw new Error("Invalid project ID");
      }

      const response = await projectApi.updateProject(projectId, data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("프로젝트 업데이트 성공:", data);
    },
    onError: (error) => {
      console.error("프로젝트 업데이트 오류:", error);
    },
  });
};
