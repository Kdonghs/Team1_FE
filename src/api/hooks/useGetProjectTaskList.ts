import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "qs";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type { GetList, GetTaskListData } from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getProjectTaskList = async (
  projectId: number,
  query: { param: GetList; status?: string; priority?: string; owner?: string }
): Promise<GetTaskListData> => {
  const testToken = getTestToken();
  const response = await projectApi.getTaskList(
    projectId,
    { param: query.param },
    {
      headers: {
        Authorization: `Bearer ${testToken}`,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
    }
  );

  return response.data;
};

export const useGetProjectTaskList = (
  projectId: number,
  size: number,
  sort: string,
  status?: string,
  priority?: string,
  owner?: string
) =>
  useInfiniteQuery<GetTaskListData, Error>({
    queryKey: ["taskList", projectId, size, sort, status, priority, owner],
    queryFn: ({ pageParam = 0 }) => {
      return getProjectTaskList(projectId, {
        param: {
          page: Number(pageParam),
          size,
          sort,
        },
        status,
        priority,
        owner,
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
