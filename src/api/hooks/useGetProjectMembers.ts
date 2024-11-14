import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "qs";

import { authProjectApi } from "../Api";
import type {
  GetList,
  GetMemberList,
  GetMemberListData,
} from "../generated/data-contracts";

export const getProjectMembers = async (
  projectId: number,
  query: { param: GetList; memberListRequestDTO: GetMemberList },
): Promise<GetMemberListData> => {
  const response = await authProjectApi.getMemberList(
    projectId,
    { memberListRequestDTO: query.memberListRequestDTO },
    {
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
    },
  );

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
      const query = {
        param: {
          page: Number(pageParam),
          size,
          sort,
        },
        memberListRequestDTO: {
          role: role || "",
        } as GetMemberList,
      };

      return getProjectMembers(projectId, query);
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
