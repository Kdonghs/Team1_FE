import { useQuery } from "@tanstack/react-query";

import type { TeamProgress } from "@/types";

import { fetchInstance } from "../instance";

export type TeamProgressResponseData = {
  teamProgress: TeamProgress[];
};

export const getTeamProgressPath = (projectId: number, role?: string) => {
  const url = new URL(
    `http://seamplessup.com/api/project/${projectId}/task/progress`
  );
  if (role) {
    url.searchParams.append("role", role);
  }
  return url.toString();
};

const TeamProgressQueryKey = (projectId: number, role?: string) => [
  "teamProgress",
  projectId,
  role,
];

export const getTeamProgress = async (
  projectId: number,
  role?: string
): Promise<TeamProgressResponseData> => {
  const response = await fetchInstance.get<TeamProgressResponseData>(
    getTeamProgressPath(projectId, role)
  );
  return response.data;
};

export const useGetTeamProgress = (projectId: number, role?: string) =>
  useQuery<TeamProgressResponseData, Error>({
    queryKey: TeamProgressQueryKey(projectId, role),
    queryFn: () => getTeamProgress(projectId, role),
    enabled: !!projectId,
  });
