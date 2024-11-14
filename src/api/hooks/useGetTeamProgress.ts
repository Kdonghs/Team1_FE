import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "qs";

import { authProjectApi } from "../Api";
import type {
  GetList,
  PageResultMemberProgress,
} from "../generated/data-contracts";

export const getTeamProgress = async (
  projectId: number,
  query: { page: number; size: number; sort: string },
): Promise<PageResultMemberProgress> => {
  const queryParams: GetList = {
    page: query.page,
    size: query.size,
    sort: query.sort,
  };

  const response = await authProjectApi.getMemberProgress(
    projectId,
    { param: queryParams },
    {
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
    },
  );

  return response.data;
};

export const useGetTeamProgress = (
  projectId: number,
  size: number,
  sort: string,
  role?: string,
) =>
  useInfiniteQuery<PageResultMemberProgress, Error>({
    queryKey: ["teamProgress", projectId, size, sort, role],
    queryFn: ({ pageParam = 0 }) => {
      return getTeamProgress(projectId, {
        page: Number(pageParam),
        size,
        sort,
      });
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
