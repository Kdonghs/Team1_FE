export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type Role = "developer" | "designer" | "all";

export type TeamMember = {
  id: number;
  name: string;
  role: Role;
  imageURL: string;
};

export interface MemberCodeResponse {
  errorCode: number;
  errorMessage: string;
  resultData: {
    token: string;
    projectId: string;
  };
}

export type ActiveTask = {
  id: number;
  name: string;
  progress: number;
  description: string;
  startDate: string;
  endDate: string;
};

export type TeamProgress = {
  teamMember: TeamMember;
  progress: number;
  activeTasks: ActiveTask[];
};

export interface Project {
  id: number;
  name: string;
  description?: string;
  imageURL?: string;
  startDate: string;
  endDate: string;
  optionIds: number[];
}

export interface ProjectData {
  name: string;
  description?: string;
  imageURL?: string;
  startDate: string;
  endDate: string;
  optionIds: number[];
  endDateAfterStartDate: boolean;
  atLeastOneDayDifference: boolean;
}

export interface Profile {
  username: string;
  email: string;
  picture: string;
  role: string;
  createDate: string;
}

// api/types.ts
export interface ProjectListResponse {
  resultData: Array<{
    id: string | number;
    name: string;
    startDate: string;
    endDate: string;
    optionIds: string[];
    imageURL?: string;
  }>;
  hasNext: boolean;
  // ... 기타 필요한 필드들
}