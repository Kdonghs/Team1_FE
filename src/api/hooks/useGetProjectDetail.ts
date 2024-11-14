import { useQuery } from "@tanstack/react-query";

import { authProjectApi } from "../Api";
import type { ProjectDetail } from "../generated/data-contracts";

const getProjectDetail = async (
  projectId: number
): Promise<ProjectDetail | null> => {
  try {
    const response = await authProjectApi.getProject(projectId);

    if (!response.data || !response.data.resultData) {
      throw new Error("Project data not found");
    }

    return response.data.resultData;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch project details"
    );
  }
};

export const useGetProjectDetail = (projectId: number | null) => {
  return useQuery<ProjectDetail | null, Error>({
    queryKey: ["project", projectId],
    queryFn: () => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }

      return getProjectDetail(projectId);
    },
    enabled: !!projectId,
  });
};
