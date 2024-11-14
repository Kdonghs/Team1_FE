import { useQuery } from "@tanstack/react-query";

import { authProjectApi } from "../Api";
import type { SingleResultMemberResponseDTO } from "../generated/data-contracts"; // 멤버의 데이터 타입

export const getProjectMember = async (
  projectId: number,
  memberId: number
): Promise<SingleResultMemberResponseDTO> => {
  const response = await authProjectApi.getMember(projectId, memberId, {});

  return response.data;
};

export const useGetProjectMember = (projectId: number, memberId: number) =>
  useQuery<SingleResultMemberResponseDTO, Error>({
    queryKey: ["projectMember", projectId, memberId],
    queryFn: () => getProjectMember(projectId, memberId),
    enabled: !!projectId && !!memberId,
  });
