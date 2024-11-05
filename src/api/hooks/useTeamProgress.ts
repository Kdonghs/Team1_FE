import { useQuery } from "@tanstack/react-query";

import type { PageResultMemberProgress } from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getTeamProgress = async (
  projectId: number,
  page: number,
  size: number,
  sort: string,
  role?: string
): Promise<PageResultMemberProgress> => {
  // TODO: any 어떻게해결하지..
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    page,
    size,
    sort,
    role,
  };

  const response = await projectApi.getMemberProgress(projectId, query);

  return response.data;
};

export const useGetTeamProgress = (
  projectId: number,
  page: number,
  size: number,
  sort: string,
  role?: string
) =>
  useQuery<PageResultMemberProgress, Error>({
    queryKey: ["teamProgress", projectId, page, size, sort, role],
    queryFn: () => getTeamProgress(projectId, page, size, sort, role),
    enabled: !!projectId,
  });
