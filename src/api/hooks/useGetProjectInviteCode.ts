import { useQuery } from "@tanstack/react-query";

import type { GenerateInviteLinkData } from "@/api/generated/data-contracts";

import { projectApi } from "../projectApi";

const getProjectInviteCode = async (
  projectId: number
): Promise<GenerateInviteLinkData | null> => {
  try {
    const response = await projectApi.generateInviteLink(projectId, {
      headers: {
        // Authorization: `Bearer ${testToken}`,
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
        : "Failed to fetch project invite code"
    );
  }
};

export const useGetProjectInviteCode = (projectId: number | null) => {
  return useQuery<GenerateInviteLinkData | null, Error>({
    queryKey: ["projectInviteCode", projectId],
    queryFn: () => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }

      return getProjectInviteCode(projectId);
    },
    enabled: !!projectId,
  });
};
