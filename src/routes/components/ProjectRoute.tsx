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

interface ProjectMember {
  message: string;
  name: string;
  role: string;
  email: string;
  getattendURL: string;
  id: number;
}

interface ProjectMembersResponse {
  errorCode: number;
  errorMessage: string;
  resultData: ProjectMember[];
  size: number;
  page: number;
  pages: number;
  hasNext: boolean;
  total: number;
}

export const ProjectRoute = () => {
  const { id } = useParams<{ id: string }>();
  const token = authSessionStorage.get();

  // 프로젝트 멤버 조회 (먼저 실행)
  const { data: membersResponse, isLoading: isMembersLoading } = useQuery<
    ProjectMembersResponse,
    AxiosError
  >({
    queryKey: ["project-members", id],
    queryFn: async () => {
      if (!token || !id) {
        throw new Error("인증 정보 또는 프로젝트 ID가 없습니다.");
      }

      const response = await axios.get<ProjectMembersResponse>(
        `/api/project/${id}/member`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("프로젝트 멤버 조회 응답:", response.data);
      return response.data;
    },
    enabled: !!id && !!token,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  // JWT 토큰에서 이메일 추출
  const getCurrentUserEmail = () => {
    const tokens = authSessionStorage.get();
    if (!tokens) return null;

    try {
      const payload = JSON.parse(atob(tokens.split(".")[1]));
      return payload.email || null;
    } catch (error) {
      console.error("토큰에서 이메일 추출 실패:", error);
      return null;
    }
  };

  // 접근 권한 확인
  const checkAccess = () => {
    const currentUserEmail = getCurrentUserEmail();
    if (!currentUserEmail || !membersResponse?.resultData) return false;

    return membersResponse.resultData.some(
      (member) => member.email === currentUserEmail
    );
  };

  // 프로젝트 상세 정보 조회 (멤버 확인 후 실행)
  const { data: projectResponse, isLoading: isProjectLoading } = useQuery<
    ProjectResponse,
    AxiosError
  >({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }
      if (!id) {
        throw new Error("Project ID is required");
      }

      try {
        const response = await axios.get<ProjectResponse>(
          `/api/project/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("프로젝트 상세 조회 응답:", response.data);
        return response.data;
      } catch (error) {
        console.error("프로젝트 상세 조회 실패:", error);
        throw error;
      }
    },
    enabled: !!id && !!token && checkAccess(), // 멤버 확인 후에만 실행
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  if (!token) {
    return <Navigate to={RouterPath.login} />;
  }

  if (isMembersLoading) {
    return <div>Loading...</div>;
  }

  // 먼저 멤버 접근 권한 확인
  if (!checkAccess()) {
    console.log("프로젝트 접근 권한이 없습니다.");
    return <Navigate to={RouterPath.projectList} />;
  }

  // 멤버 권한이 확인된 후 프로젝트 정보 로딩 체크
  if (isProjectLoading) {
    return <div>Loading...</div>;
  }

  if (!projectResponse || projectResponse.errorCode !== 200) {
    console.log("프로젝트 접근 실패:", projectResponse?.errorMessage);
    return <Navigate to={RouterPath.projectList} />;
  }

  return <Outlet />;
};
