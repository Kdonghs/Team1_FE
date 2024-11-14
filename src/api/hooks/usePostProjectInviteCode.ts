import { useQuery } from "@tanstack/react-query";

import type { GenerateInviteLinkData } from "@/api/generated/data-contracts";

import { authProjectApi } from "../Api";

const postProjectInviteCode = async (
  projectId: number,
): Promise<GenerateInviteLinkData | null> => {
  try {
    const response = await authProjectApi.generateInviteLink(projectId);

    if (!response.data || !response.data.resultData) {
      throw new Error("Project data not found");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch project invite code",
    );
  }
};

export const usePostProjectInviteCode = (projectId: number | null) => {
  return useQuery<GenerateInviteLinkData | null, Error>({
    queryKey: ["projectInviteCode", projectId],
    queryFn: () => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }

      return postProjectInviteCode(projectId);
    },
    enabled: !!projectId,
  });
};
