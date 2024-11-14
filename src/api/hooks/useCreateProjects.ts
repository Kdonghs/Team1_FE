import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";

import { authSessionStorage } from "../../utils/storage";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = authSessionStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface CreateProjectRequest {
  name: string;
  description: string;
  imageURL?: string | undefined;
  optionIds: number[];
  startDate: string;
  endDate: string;
  endDateAfterStartDate: boolean;
  atLeastOneDayDifference: boolean;
}

export interface ProjectManager {
  name: string;
  imageURL: string;
}

export interface ProjectResponse {
  id: number;
  name: string;
  description: string;
  imageURL: string;
  startDate: string;
  endDate: string;
  optionIds: number[];
  totalMembers: number;
  projectManager: ProjectManager;
}

export interface ApiResponse<T> {
  errorCode: number;
  errorMessage: string;
  resultData: T;
  success: boolean; // 성공 여부 필드 추가
}

interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
}

export const useCreateProject = (onError?: (message: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ProjectResponse>,
    AxiosError<ErrorResponse>,
    CreateProjectRequest
  >({
    mutationFn: async (data: CreateProjectRequest) => {
      try {
        const response = await api.post<ApiResponse<ProjectResponse>>(
          "/project",
          data,
        );
        return response.data;
      } catch (error) {
        if (!axios.isAxiosError(error)) {
          throw new Error("알 수 없는 에러가 발생했습니다.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
        refetchType: "all",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message || "프로젝트 생성에 실패했습니다.";

      console.error("프로젝트 생성 중 에러:", error);

      if (onError) {
        onError(errorMessage);
      }

      if (error.response?.status === 401) {
        authSessionStorage.set(undefined);
        window.location.href = "/";
      }
    },
  });
};
