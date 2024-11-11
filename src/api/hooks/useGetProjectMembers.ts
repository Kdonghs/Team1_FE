import { useInfiniteQuery } from "@tanstack/react-query";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type { GetMemberListData } from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getProjectMembers = async (
  projectId: number,
  query: { page: number; size: number; sort: string },
  role?: string
): Promise<GetMemberListData> => {
  // TODO: any 해결
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = {
    page: query.page,
    size: query.size,
    sort: query.sort,
    role,
  };

  const testToken = getTestToken();
  const response = await projectApi.getMemberList(projectId, queryParams, {
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });

  return response.data;
};

export const useGetProjectMembers = (
  projectId: number,
  size: number,
  sort: string,
  role?: string,
) =>
  useInfiniteQuery<GetMemberListData, Error>({
    queryKey: ["projectMembers", projectId, size, sort, role],
    queryFn: ({ pageParam = 0 }) => {
      return getProjectMembers(
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
