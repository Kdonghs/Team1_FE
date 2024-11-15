import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";

import { authSessionStorage } from "../../utils/storage";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
};

interface ProjectDateResponse {
  errorCode: number;
  errorMessage: string;
  resultData: Project[];
  size: number;
  page: number;
  pages: number;
  hasNext: boolean;
  total: number;
}

export const useGetProjectDates = () => {
      return useQuery<ProjectDateResponse, AxiosError>({
        queryKey: ["projectDates"],
        queryFn: async () => {
          const accessToken = authSessionStorage.get()?.token;

          if (!accessToken) {
            throw new Error("인증 토큰이 없습니다.");
          }

          console.log("프로젝트 일정 조회 요청");
          const response = await axios.get<ProjectDateResponse>("/api/project/date", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          console.log("프로젝트 일정 조회 응답:", response.data);
          return response.data;
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 1,
      });
    };