import { useQuery } from "@tanstack/react-query";
import qs from "qs";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type {
  GetList,
  GetProjectProgressData,
} from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getProjectProgress = async (
  projectId: number,
  query: { param: GetList }
): Promise<GetProjectProgressData> => {
  const testToken = getTestToken();

  const response = await projectApi.getProjectProgress(projectId, query, {
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "brackets" }),
  });

  return response.data;
};

export const useGetProjectProgress = (projectId: number) =>
  useQuery<GetProjectProgressData, Error>({
    queryKey: ["projectMember", projectId],
    queryFn: () =>
      getProjectProgress(projectId, {
        param: { page: 0 }, // TODO: required param 삭제 요청
      }),
    enabled: !!projectId,
  });
