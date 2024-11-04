import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  ProjectUpdate,
  SingleResultProjectDetail,
} from "../../api/generated/data-contracts";
import { projectApi } from "../projectApi";

export const useUpdateProject = (
  projectId: number | null,
  selectedFeature: string
) => {
  const queryClient = useQueryClient();
  return useMutation<SingleResultProjectDetail, Error, ProjectUpdate>({
    mutationFn: async (data: ProjectUpdate) => {
      if (projectId === null) {
        throw new Error("Invalid project ID");
      }
      const updateData =
        selectedFeature === "기본" ? { ...data, optionIds: [2, 4] } : data;

      const response = await projectApi.updateProject(projectId, updateData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      console.log("프로젝트 업데이트 성공:", data);
    },
    onError: (error) => {
      console.error("프로젝트 업데이트 오류:", error);
    },
  });
};
