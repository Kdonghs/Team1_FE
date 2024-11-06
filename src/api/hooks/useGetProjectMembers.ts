import { useQuery } from "@tanstack/react-query";

import type { GetProjectMembersData } from "@/api/generated/data-contracts";

import { getTestToken } from "../../components/features/Project/TokenTest";
import { projectApi } from "../projectApi";

const getProjectMembers = async (
  projectId: number
): Promise<GetProjectMembersData | null> => {
  try {
    const testToken = getTestToken();
    const response = await projectApi.getProjectMembers(projectId, {
      headers: {
        Authorization: `Bearer ${testToken}`,
      },
    });

    if (!response.data || !response.data.resultData) {
      throw new Error("Project data not found");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch project members data"
    );
  }
};

export const useGetProjectMembers = (projectId: number | null) => {
  return useQuery<GetProjectMembersData | null, Error>({
    queryKey: ["projectMembers", projectId],
    queryFn: () => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }

      return getProjectMembers(projectId);
    },
    enabled: !!projectId,
  });
};
