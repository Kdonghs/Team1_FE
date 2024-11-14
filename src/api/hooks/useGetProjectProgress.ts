import { useQuery } from "@tanstack/react-query";
import qs from "qs";

import { authProjectApi } from "../Api";
import type {
  GetList,
  GetProjectProgressData,
} from "../generated/data-contracts";

export const getProjectProgress = async (
  projectId: number,
  query: { param: GetList }
): Promise<GetProjectProgressData> => {
  const response = await authProjectApi.getProjectProgress(projectId, query, {
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
