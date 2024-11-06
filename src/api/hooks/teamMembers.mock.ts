import { rest } from "msw";

import type { PageResultMemberResponseDTO } from "../generated/data-contracts";

const mockProjectMembers: PageResultMemberResponseDTO = {
  errorCode: 0,
  errorMessage: "Success",
  resultData: [
    {
      name: "John Doe",
      role: "Developer",
      email: "john.doe@example.com",
      getattendURL: "/attendance/1",
    },
    {
      name: "Jane Smith",
      role: "Designer",
      email: "jane.smith@example.com",
      getattendURL: "/attendance/2",
    },
  ],
  size: 10,
  page: 0,
  pages: 1,
  hasNext: false,
  total: 2,
};

export const memberMockHandler = [
  rest.get(
    "https://seamlessup.com/api/project/:projectId/member",
    (_, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockProjectMembers));
    }
  ),
];
