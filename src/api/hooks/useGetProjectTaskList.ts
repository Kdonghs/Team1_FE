import { useInfiniteQuery } from "@tanstack/react-query";

import { authProjectApi } from "../Api";
import type { GetTaskListData } from "../generated/data-contracts";

export const getProjectTaskList = async (
  projectId: number,
  query: { page: number; size: number; sort: string },
  status?: string,
  priority?: string,
  owner?: string,
): Promise<GetTaskListData> => {
  //TODO: any 해결방법 찾기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = {
    page: query.page,
    size: query.size,
    sort: query.sort,
    status,
    priority,
    owner,
  };
  const response = await authProjectApi.getTaskList(projectId, queryParams, {});
  return response.data;
};

export const useGetProjectTaskList = (
  projectId: number,
  size: number,
  sort: string,
  status?: string,
  priority?: string,
  owner?: string,
) =>
  useInfiniteQuery<GetTaskListData, Error>({
    queryKey: ["taskList", projectId, status, priority, owner],
    queryFn: ({ pageParam = 0 }) => {
      return getProjectTaskList(
        projectId,
        { page: Number(pageParam), size, sort },
        status,
        priority,
        owner,
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
