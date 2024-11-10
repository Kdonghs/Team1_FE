import { useInfiniteQuery } from "@tanstack/react-query";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type { PageResultMemberProgress } from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getTeamProgress = async (
  projectId: number,
  query: { page: number; size: number; sort: string },
  role?: string
): Promise<PageResultMemberProgress> => {
  //TODO: any 해결방법 찾기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = {
    page: query.page,
    size: query.size,
    sort: query.sort,
    role,
  };

  const testToken = getTestToken();
  const response = await projectApi.getMemberProgress(projectId, queryParams, {
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });

  return response.data;
};

export const useGetTeamProgress = (
  projectId: number,
  size: number,
  sort: string,
  role?: string
) =>
  useInfiniteQuery<PageResultMemberProgress, Error>({
    queryKey: ["teamProgress", projectId, size, sort, role],
    queryFn: ({ pageParam = 0 }) => {
      return getTeamProgress(
        projectId,
        { page: Number(pageParam), size, sort },
        role
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page !== undefined && lastPage.hasNext) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!projectId,
  });
