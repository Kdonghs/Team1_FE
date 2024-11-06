import { useQuery } from "@tanstack/react-query";

import { getTestToken } from "../../components/features/Project/TokenTest";
import type { GetMemberListData } from "../generated/data-contracts";
import { projectApi } from "../projectApi";

export const getProjectMembers = async (
  projectId: number,
  page: number,
  size: number,
  sort: string,
  role?: string
): Promise<GetMemberListData> => {
  // TODO: any 어떻게해결하지..
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {
    page,
    size,
    sort,
    role,
  };
  const testToken = getTestToken();
  const response = await projectApi.getMemberList(projectId, query, {
    headers: {
      Authorization: `Bearer ${testToken}`, // Authorization 헤더에 토큰 추가
    },
  });

  return response.data;
};

export const useGetProjectMembers = (
  projectId: number,
  page: number,
  size: number,
  sort: string,
  role?: string
) =>
  useQuery<GetMemberListData, Error>({
    queryKey: ["projectMembers", projectId, page, size, sort, role],
    queryFn: () => getProjectMembers(projectId, page, size, sort, role),
    enabled: !!projectId,
  });

// import { useQuery } from "@tanstack/react-query";

// import type { GetProjectMembersData } from "@/api/generated/data-contracts";

// import { getTestToken } from "../../components/features/Project/TokenTest";
// import { projectApi } from "../projectApi";

// const getProjectMembers = async (
//   projectId: number
// ): Promise<GetProjectMembersData | null> => {
//   try {
//     const testToken = getTestToken();
//     const response = await projectApi.getProjectMembers(projectId, {
//       headers: {
//         Authorization: `Bearer ${testToken}`,
//       },
//     });

//     if (!response.data || !response.data.resultData) {
//       throw new Error("Project data not found");
//     }

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error instanceof Error
//         ? error.message
//         : "Failed to fetch project members data"
//     );
//   }
// };

// export const useGetProjectMembers = (projectId: number | null) => {
//   return useQuery<GetProjectMembersData | null, Error>({
//     queryKey: ["projectMembers", projectId],
//     queryFn: () => {
//       if (projectId === null) {
//         throw new Error("Project ID cannot be null");
//       }

//       return getProjectMembers(projectId);
//     },
//     enabled: !!projectId,
//   });
// };
