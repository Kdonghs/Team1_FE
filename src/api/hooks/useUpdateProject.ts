import { useMutation } from "@tanstack/react-query";

import type {
  ProjectUpdate,
  SingleResultProjectDetail,
} from "../../api/generated/data-contracts";
import { authProjectApi } from "../Api";

export const useUpdateProject = (projectId: number | null) => {
  // const queryClient = useQueryClient();
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
    //TODO: 사용하는 컴포넌트에서 invalid / refetchQUeries 설정하기
    // onSuccess: (data) => {
    //   queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    //   console.log("프로젝트 업데이트 성공:", data);
    // },
    // onError: (error) => {
    //   console.error("프로젝트 업데이트 오류:", error);
    // },
  });
};
