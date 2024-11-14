import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { Navigate, Outlet, useParams } from "react-router-dom";

import { useAuth } from "../../provider/Auth";
import { authSessionStorage } from "../../utils/storage";
import { RouterPath } from "../path";

interface ProjectManager {
  name: string;
  imageURL: string;
}

interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  imageURL: string | null;
  startDate: string;
  endDate: string;
  optionIds: number[];
  totalMembers: number;
  projectManager: ProjectManager;
}

interface ProjectResponse {
  errorCode: number;
  errorMessage: string;
  resultData: ProjectDetail;
}

export const ProjectRoute = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuth();
  const token = authSessionStorage.get();

  const { data: response, isLoading } = useQuery<ProjectResponse, AxiosError>({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      if (!id) {
        throw new Error("Project ID is required");
      }

      console.log("프로젝트 상세 조회 요청:", id);
      const responses = await axios.get<ProjectResponse>(`/api/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("프로젝트 상세 조회 응답:", responses.data);
      return responses.data;
    },
    enabled: !!id && !!token,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  if (!user || !token) {
    return <Navigate to={RouterPath.login} />;
  }

  if (isLoading) {
    return <div />;
  }

  if (!response || response.errorCode !== 200) {
    console.log("프로젝트 접근 실패:", response?.errorMessage);
    return <Navigate to={RouterPath.projectList} />;
  }

  return <Outlet />;
};
