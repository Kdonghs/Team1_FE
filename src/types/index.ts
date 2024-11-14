export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type Role = "developer" | "designer" | "all";

export type TeamMember = {
  id: number;
  name: string;
  role: Role;
  imageURL: string;
};
