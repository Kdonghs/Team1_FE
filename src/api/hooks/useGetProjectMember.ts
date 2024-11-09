import { useQuery } from "@tanstack/react-query";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type { SingleResultMemberResponseDTO } from "../generated/data-contracts"; // 멤버의 데이터 타입
import { projectApi } from "../projectApi";

export const getProjectMember = async (
  projectId: number,
  memberId: number
): Promise<SingleResultMemberResponseDTO> => {
  const testToken = getTestToken();
  const response = await projectApi.getMember(projectId, memberId, {
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });

  return response.data;
};

export const useGetProjectMember = (projectId: number, memberId: number) =>
  useQuery<SingleResultMemberResponseDTO, Error>({
    queryKey: ["projectMember", projectId, memberId],
    queryFn: () => getProjectMember(projectId, memberId),
    enabled: !!projectId && !!memberId,
  });
