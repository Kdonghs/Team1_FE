import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "qs";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type {
  GetList,
  GetMemberList,
  GetMemberListData,
} from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getProjectMembers = async (
  projectId: number,
  query: { param: GetList; memberListRequestDTO: GetMemberList }
): Promise<GetMemberListData> => {
  const testToken = getTestToken();

  const response = await projectApi.getMemberList(
    projectId,
    { memberListRequestDTO: query.memberListRequestDTO },
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

export const useGetProjectMembers = (
  projectId: number,
  size: number,
  sort: string,
  role?: string
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
