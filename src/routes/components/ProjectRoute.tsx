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
  const token = authSessionStorage.get()?.token;

  // JWT 토큰에서 이메일 추출
  const getCurrentUserEmail = () => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("현재 사용자 이메일:", payload.email);
      return payload.email || null;
    } catch (error) {
      console.error("토큰 복호화 실패:", error);
      return null;
    }
  };

  // 프로젝트 상세 정보 조회 먼저 시도
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
      console.log("프로젝트 상세 조회 요청:", id);
      const response = await axios.get<ProjectResponse>(`/api/project/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("프로젝트 상세 조회 응답:", response.data);
      return response.data;
    },
    enabled: !!id && !!token,
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  // 프로젝트 멤버 조회
  const { data: membersResponse, isLoading: isMembersLoading } = useQuery<
    ProjectMembersResponse,
    AxiosError
  >({
    queryKey: ["project-members", id],
    queryFn: async () => {
      if (!token || !id) {
        throw new Error("인증 정보 또는 프로젝트 ID가 없습니다.");
      }

      // memberListRequestDTO 파라미터 (query parameter)
      const params = {
        memberListRequestDTO: {
          // 필요한 경우 여기에 memberListRequestDTO 객체의 속성들을 추가
        },
      };

      console.log("프로젝트 멤버 조회 요청:", {
        projectId: id,
        params: params,
      });

      const response = await axios.get<ProjectMembersResponse>(
        `/api/project/${id}/member`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: params, // query parameter 추가
        }
      );

      console.log("프로젝트 멤버 조회 응답:", {
        errorCode: response.data.errorCode,
        memberCount: response.data.resultData?.length || 0,
        totalMembers: response.data.total,
        currentPage: response.data.page,
        totalPages: response.data.pages,
      });

      return response.data;
    },
    enabled:
      !!id &&
      !!token &&
      (!projectResponse || projectResponse.errorCode !== 200),
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  // 멤버 접근 권한 확인
  const checkMemberAccess = () => {
    const currentEmail = getCurrentUserEmail();
    if (!currentEmail || !membersResponse?.resultData) return false;

    const isProjectMember = membersResponse.resultData.some(
      (member) => member.email === currentEmail
    );
    console.log("멤버 접근 권한:", { isProjectMember, currentEmail });
    return isProjectMember;
  };

  if (!token) {
    console.log("인증 토큰 없음");
    return <Navigate to={RouterPath.login} />;
  }

  if (isProjectLoading) {
    return <div>Loading...</div>;
  }

  // 프로젝트 상세 조회 성공한 경우
  if (projectResponse?.errorCode === 200) {
    console.log("프로젝트 접근 성공");
    return <Outlet />;
  }

  // 프로젝트 상세 조회 실패한 경우, 멤버 조회로 접근 권한 확인
  if (isMembersLoading) {
    return <div>Loading...</div>;
  }

  if (checkMemberAccess()) {
    console.log("멤버 접근 권한 확인됨");
    return <Outlet />;
  }

  // 모든 접근 시도 실패
  console.log("프로젝트 접근 실패:", {
    projectError: projectResponse?.errorMessage,
    hasMemberAccess: checkMemberAccess(),
  });
  return <Navigate to={RouterPath.projectList} />;
};
