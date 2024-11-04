import { useMutation } from "@tanstack/react-query";

import type {
  ProjectUpdate,
  SingleResultProjectDetail,
} from "../../api/generated/data-contracts";
import { projectApi } from "../projectApi";

// TODO: 변경이 생겼을 때 타 컴포넌트의 리렌더링이 일어나지 않는 듯
export const useUpdateProject = (
  projectId: number | null,
  selectedFeature: string
) => {
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
      console.log("프로젝트 업데이트 성공:", data);
    },
    onError: (error) => {
      console.error("프로젝트 업데이트 오류:", error);
    },
  });
};
