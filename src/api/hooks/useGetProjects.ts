import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";

import { authSessionStorage } from "../../utils/storage";

export interface ProjectListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProjectListResponse {
  errorCode: number;
  errorMessage: string;
  resultData: Array<{
    id: number;
    name: string;
    description: string;
    imageURL: string;
    startDate: string;
    endDate: string;
    optionIds: number[];
    totalMembers: number;
    projectManager: {
      name: string;
      imageURL: string;
    };
  }>;
  size: number;
  page: number;
  pages: number;
  hasNext: boolean;
  total: number;
}

export const useGetProjects = (
  params: ProjectListParams = { page: 0, size: 10 }
) => {
  return useQuery<ProjectListResponse, AxiosError>({
    queryKey: ["projects", params],
    queryFn: async () => {
      const accessToken = authSessionStorage.get()?.token;

      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다.");
      }

      console.log("프로젝트 목록 조회 요청:", params);
      const response = await axios.get<ProjectListResponse>("/api/project", {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("프로젝트 목록 조회 응답:", response.data);
      return response.data;
    },
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
