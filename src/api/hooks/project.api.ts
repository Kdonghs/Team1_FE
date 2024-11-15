import type { UseMutationResult } from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import qs from "qs";

import type {
  CreateTaskData,
  DeleteTaskData,
  GenerateInviteLinkData,
  GetList,
  GetMemberList,
  GetMemberListData,
  GetProjectProgressData,
  GetTaskListData,
  PageResultMemberProgress,
  ProjectDetail,
  ProjectUpdate,
  SingleResultMemberResponseDTO,
  SingleResultProjectDetail,
  TaskCreate,
  TaskUpdate,
  UpdateMember,
  UpdateMemberData,
  UpdateTaskData,
} from "@/api/generated/data-contracts";

import { authProjectApi } from "../Api";

const getProjectDetail = async (
  projectId: number
): Promise<ProjectDetail | null> => {
  try {
    const response = await authProjectApi.getProject(projectId);

    if (!response.data || !response.data.resultData) {
      throw new Error("Project data not found");
    }

    return response.data.resultData;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch project details"
    );
  }
};

export const useGetProjectDetail = (projectId: number | null) => {
  return useQuery<ProjectDetail | null, Error>({
    queryKey: ["project", projectId],
    queryFn: () => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }

      return getProjectDetail(projectId);
    },
    enabled: !!projectId,
  });
};

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

export const getProjectMembers = async (
  projectId: number,
  query: { param: GetList; memberListRequestDTO: GetMemberList }
): Promise<GetMemberListData> => {
  const response = await authProjectApi.getMemberList(
    projectId,
    { memberListRequestDTO: query.memberListRequestDTO },
    {
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
    }
  );

  return response.data;
};

export const useGetProjectMembers = (
  projectId: number,
  size: number,
  sort: string,
  role?: string
) =>
  useInfiniteQuery<GetMemberListData, Error>({
    queryKey: ["projectMembers", projectId, size, sort, role],
    queryFn: ({ pageParam = 0 }) => {
      const query = {
        param: {
          page: Number(pageParam),
          size,
          sort,
        },
        memberListRequestDTO: {
          role: role || "",
        } as GetMemberList,
      };

      return getProjectMembers(projectId, query);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page !== undefined && lastPage.hasNext) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!projectId,
  });

export const getProjectProgress = async (
  projectId: number,
  query: { param: GetList }
): Promise<GetProjectProgressData> => {
  const response = await authProjectApi.getProjectProgress(projectId, query, {
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "brackets" }),
  });

  return response.data;
};

export const useGetProjectProgress = (projectId: number) =>
  useQuery<GetProjectProgressData, Error>({
    queryKey: ["projectMember", projectId],
    queryFn: () =>
      getProjectProgress(projectId, {
        param: { page: 0 },
      }),
    enabled: !!projectId,
  });

export const getProjectTaskList = async (
  projectId: number,
  query: { page: number; size: number; sort: string },
  status?: string,
  priority?: string,
  owner?: number
): Promise<GetTaskListData> => {
  //TODO: any 해결방법 찾기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queryParams: any = {
    page: query.page,
    size: query.size,
    sort: query.sort,
    status,
    priority,
    owner,
  };
  const response = await authProjectApi.getTaskList(projectId, queryParams, {});
  return response.data;
};

export const useGetProjectTaskList = (
  projectId: number,
  size: number,
  sort: string,
  status?: string,
  priority?: string,
  owner?: number
) =>
  useInfiniteQuery<GetTaskListData, Error>({
    queryKey: ["taskList", projectId, status, priority, owner],
    queryFn: ({ pageParam = 0 }) => {
      return getProjectTaskList(
        projectId,
        { page: Number(pageParam), size, sort },
        status,
        priority,
        owner
      );
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page !== undefined && lastPage.hasNext) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!projectId,
  });

export const getTeamProgress = async (
  projectId: number,
  query: { page: number; size: number; sort: string }
): Promise<PageResultMemberProgress> => {
  const queryParams: GetList = {
    page: query.page,
    size: query.size,
    sort: query.sort,
  };

  const response = await authProjectApi.getMemberProgress(
    projectId,
    { param: queryParams },
    {
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
    }
  );

  return response.data;
};

export const useGetTeamProgress = (
  projectId: number,
  size: number,
  sort: string,
  role?: string
) =>
  useInfiniteQuery<PageResultMemberProgress, Error>({
    queryKey: ["teamProgress", projectId, size, sort, role],
    queryFn: ({ pageParam = 0 }) => {
      return getTeamProgress(projectId, {
        page: Number(pageParam),
        size,
        sort,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page !== undefined && lastPage.hasNext) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!projectId,
  });

const postProjectInviteCode = async (
  projectId: number
): Promise<GenerateInviteLinkData | null> => {
  try {
    const response = await authProjectApi.generateInviteLink(projectId);

    if (!response.data || !response.data.resultData) {
      throw new Error("Project data not found");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch project invite code"
    );
  }
};

export const usePostProjectInviteCode = (projectId: number | null) => {
  return useQuery<GenerateInviteLinkData | null, Error>({
    queryKey: ["projectInviteCode", projectId],
    queryFn: () => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }

      return postProjectInviteCode(projectId);
    },
    enabled: !!projectId,
  });
};

const postTask = async (
  projectId: number,
  data: TaskCreate
): Promise<CreateTaskData> => {
  try {
    const response = await authProjectApi.createTask(projectId, data);

    if (!response.data) {
      throw new Error("Task creation failed");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to create task"
    );
  }
};

export const usePostProjectTask = (projectId: number | null) => {
  return useMutation<CreateTaskData, Error, TaskCreate>({
    mutationFn: (data: TaskCreate) => {
      if (projectId === null) {
        throw new Error("Project ID cannot be null");
      }
      return postTask(projectId, data);
    },
  });
};

const deleteProjectTask = async (taskId: number) => {
  const response = await authProjectApi.deleteTask(taskId);
  return response.data;
};

export const useDeleteProjectTask = (): UseMutationResult<
  DeleteTaskData,
  AxiosError,
  { taskId: number }
> => {
  return useMutation<DeleteTaskData, AxiosError, { taskId: number }>({
    mutationFn: async ({ taskId }) => {
      return deleteProjectTask(taskId);
    },
  });
};

export const useUpdateProject = (projectId: number | null) => {
  return useMutation<SingleResultProjectDetail, Error, ProjectUpdate>({
    mutationFn: async (data: ProjectUpdate) => {
      if (projectId === null) {
        throw new Error("Invalid project ID");
      }
      const updateData = data;

      const response = await authProjectApi.updateProject(
        projectId,
        updateData
      );
      return response.data;
    },
  });
};

export const useUpdateProjectTask = (taskId: number | null) => {
  return useMutation<UpdateTaskData, Error, TaskUpdate>({
    mutationFn: async (data: TaskUpdate) => {
      if (taskId === null) {
        throw new Error("Invalid task ID");
      }
      const updateData = data;

      const response = await authProjectApi.updateTask(taskId, updateData);
      return response.data;
    },
  });
};

type UpdateMemberParams = {
  projectId: number;
  memberId: number;
  data: UpdateMember;
};

const updateMember = async (
  projectId: number,
  memberId: number,
  data: UpdateMember
) => {
  const response = await authProjectApi.updateMember(projectId, memberId, data);
  return response.data;
};

export const useUpdateMember = (): UseMutationResult<
  UpdateMemberData,
  AxiosError,
  UpdateMemberParams
> => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMemberData, AxiosError, UpdateMemberParams>({
    mutationFn: async ({ projectId, memberId, data }) => {
      return updateMember(projectId, memberId, data);
    },
    onSuccess: (data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamProgress", projectId],
      });

      console.log("팀원 정보 수정 성공:", data);
    },
    onError: (error) => {
      console.error("팀원 정보 수정 오류:", error);
    },
  });
};

type DeleteMemberParams = {
  projectId: number;
  memberId: number;
};

const deleteMember = async (projectId: number, memberId: number) => {
  const response = await authProjectApi.deleteMember(projectId, memberId, {});
  return response.data;
};

export const useDeleteMember = (): UseMutationResult<
  SingleResultMemberResponseDTO,
  AxiosError,
  DeleteMemberParams
> => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleResultMemberResponseDTO,
    AxiosError,
    DeleteMemberParams
  >({
    mutationFn: async ({ projectId, memberId }) => {
      return deleteMember(projectId, memberId);
    },
    onSuccess: (data, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teamProgress", projectId],
      });

      console.log("팀원 삭제 성공:", data);
    },
    onError: (error) => {
      console.error("팀원 삭제 오류:", error);
    },
  });
};
