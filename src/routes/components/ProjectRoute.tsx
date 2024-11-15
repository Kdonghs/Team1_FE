import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { Navigate, Outlet, useParams } from "react-router-dom";

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

interface ProjectMemberResponse {
  errorCode: number;
  errorMessage: string;
  resultData: {
    message: string;
    name: string;
    role: string;
    email: string;
    getattendURL: string;
    id: number;
  };
}

export const ProjectRoute = () => {
  const { id } = useParams<{ id: string }>();
  const token = authSessionStorage.get();

  // 프로젝트 상세 정보 조회
  const { data: projectResponse, isLoading: isProjectLoading } = useQuery<
    ProjectResponse,
    AxiosError
  >({
    queryKey: ["project", id],
    queryFn: async () => {
      const currentToken = authSessionStorage.get()?.token;
      if (!currentToken) {
        throw new Error("인증 토큰이 없습니다.");
      }
      if (!id) {
        throw new Error("Project ID is required");
      }
      const response = await axios.get<ProjectResponse>(`/api/project/${id}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  // 프로젝트 멤버 본인 조회
  const { data: memberResponse, isLoading: isMemberLoading } = useQuery<
    ProjectMemberResponse,
    AxiosError
  >({
    queryKey: ["project-member-me", id],
    queryFn: async () => {
      const currentToken = authSessionStorage.get()?.token;
      if (!currentToken || !id) {
        throw new Error("인증 정보 또는 프로젝트 ID가 없습니다.");
      }
      const response = await axios.get<ProjectMemberResponse>(
        `/api/project/${id}/member/me`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    enabled: !!id && !!token && projectResponse?.errorCode !== 200,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  if (!token) {
    return <Navigate to={RouterPath.login} />;
  }

  if (isProjectLoading || (isMemberLoading && projectResponse?.errorCode !== 200)) {
    return <div>Loading...</div>;
  }

  if (projectResponse?.errorCode === 200) {
    return <Outlet />;
  }

  if (memberResponse?.errorCode === 200) {
    return <Outlet />;
  }

  return <Navigate to={RouterPath.projectList} />;
};